"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Vidéo détourée (fond transparent), lisible sur tous les navigateurs.
 *
 * Pourquoi pas une simple balise `<video>` ? Parce que la transparence vidéo
 * n'a pas de format commun : Chrome et Firefox lisent le WebM avec couche
 * alpha, Safari exige un HEVC spécial qu'on ne sait produire que sur Mac.
 *
 * On contourne le problème avec la technique du « stacked alpha » :
 *   - un MP4 H.264 ordinaire, lu partout, contient deux images empilées :
 *     l'image couleur en haut, le masque de détourage (en niveaux de gris)
 *     en bas ;
 *   - un petit shader WebGL recompose les deux à chaque image et dessine le
 *     résultat, transparent, dans un `<canvas>`.
 *
 * Le coût reste faible (un seul décodage vidéo matériel, un calcul trivial
 * par pixel sur la carte graphique) et le rendu est identique sur iPhone,
 * Android et ordinateur.
 *
 * Repli : une image WebP détourée est affichée d'emblée. Elle reste seule si
 * WebGL est indisponible, si la lecture automatique est bloquée (mode
 * économie d'énergie sur iPhone) ou si le visiteur a demandé à réduire les
 * animations. La vidéo est aussi mise en pause dès qu'elle sort de l'écran.
 */
export function VideoDetouree({
  src,
  poster,
  largeur,
  hauteur,
  alt,
  className,
}: {
  /** MP4 « empilé » : couleur en haut, masque en bas (hauteur = 2 × `hauteur`). */
  src: string;
  /** Image détourée de repli (WebP ou PNG transparent). */
  poster: string;
  /** Dimensions d'une image (et non du fichier empilé). */
  largeur: number;
  hauteur: number;
  alt: string;
  className?: string;
}) {
  const refCanvas = React.useRef<HTMLCanvasElement>(null);
  const refVideo = React.useRef<HTMLVideoElement>(null);
  const [animee, setAnimee] = React.useState(false);

  React.useEffect(() => {
    const canvas = refCanvas.current;
    const video = refVideo.current;
    if (!canvas || !video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true });
    if (!gl) return;

    const programme = creerProgramme(gl);
    if (!programme) return;

    // Un rectangle plein écran, deux triangles.
    const tampon = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tampon);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(programme, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    let image = 0;
    let annule = false;
    let premiereImage = true;

    const dessiner = () => {
      if (annule) return;
      if (video.readyState >= 2) {
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, video);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        if (premiereImage) {
          premiereImage = false;
          setAnimee(true);
        }
      }
      programmer();
    };

    // `requestVideoFrameCallback` ne redessine que lorsqu'une nouvelle image
    // est réellement décodée ; à défaut, on se cale sur l'affichage.
    const programmer = () => {
      if ("requestVideoFrameCallback" in video) {
        image = video.requestVideoFrameCallback(dessiner);
      } else {
        image = requestAnimationFrame(dessiner);
      }
    };

    const lire = () => {
      video.play().catch(() => {
        // Lecture automatique refusée : l'image fixe reste affichée.
      });
    };

    // Pause hors écran : pas de décodage inutile quand on lit le bas de page.
    const observateur = new IntersectionObserver(([entree]) => {
      if (entree?.isIntersecting) lire();
      else video.pause();
    });
    observateur.observe(canvas);
    programmer();

    return () => {
      annule = true;
      observateur.disconnect();
      if ("cancelVideoFrameCallback" in video) video.cancelVideoFrameCallback(image);
      cancelAnimationFrame(image);
      video.pause();
    };
  }, []);

  return (
    <div className={cn("relative", className)} style={{ aspectRatio: `${largeur} / ${hauteur}` }}>
      {/* eslint-disable-next-line @next/next/no-img-element -- image de repli
          superposée au canvas, dimensionnée par son conteneur */}
      <img
        src={poster}
        alt={alt}
        width={largeur}
        height={hauteur}
        fetchPriority="high"
        className={cn(
          "absolute inset-0 size-full object-contain transition-opacity duration-500",
          animee && "opacity-0",
        )}
      />
      <canvas
        ref={refCanvas}
        width={largeur}
        height={hauteur}
        aria-hidden="true"
        className="absolute inset-0 size-full"
      />
      <video
        ref={refVideo}
        src={src}
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        className="hidden"
      />
    </div>
  );
}

/**
 * Shader de recomposition : la moitié haute de la texture donne la couleur,
 * la moitié basse (canal rouge du masque) donne l'opacité. La couleur est
 * prémultipliée par l'opacité, comme l'attend le canvas.
 */
function creerProgramme(gl: WebGLRenderingContext) {
  const sommets = `
    attribute vec2 position;
    varying vec2 uv;
    void main() {
      uv = (position + 1.0) * 0.5;
      gl_Position = vec4(position, 0.0, 1.0);
    }`;
  const fragments = `
    precision mediump float;
    uniform sampler2D video;
    varying vec2 uv;
    void main() {
      vec3 couleur = texture2D(video, vec2(uv.x, 0.5 + uv.y * 0.5)).rgb;
      float alpha = texture2D(video, vec2(uv.x, uv.y * 0.5)).r;
      gl_FragColor = vec4(couleur * alpha, alpha);
    }`;

  const compiler = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
  };

  const vs = compiler(gl.VERTEX_SHADER, sommets);
  const fs = compiler(gl.FRAGMENT_SHADER, fragments);
  const programme = gl.createProgram();
  if (!vs || !fs || !programme) return null;
  gl.attachShader(programme, vs);
  gl.attachShader(programme, fs);
  gl.linkProgram(programme);
  if (!gl.getProgramParameter(programme, gl.LINK_STATUS)) return null;
  gl.useProgram(programme);
  return programme;
}

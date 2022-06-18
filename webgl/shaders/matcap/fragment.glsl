#define MATCAP
#define USE_MATCAP

uniform sampler2D uTexture;
uniform sampler2D matcap;
uniform vec3 color;

varying vec3 vViewPosition;

// Custom start
uniform mat3 normalMatrix;

varying vec3 vWorldPosition;
// Custom end

#ifndef FLAT_SHADED

varying vec3 vNormal;
varying vec2 vUv;

#endif

#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <fog_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

void main() {

  #include <clipping_planes_fragment>

  #ifdef USE_DIFFUSE_COLOR

    vec4 diffuseColor = vec4(color, 1.0);


  #else

    vec4 diffuseColor = texture2D(uTexture, vUv);
    if (diffuseColor.a == 0.0) diffuseColor.rgb = color;
    diffuseColor.a = 1.0;

  #endif


  #include <logdepthbuf_fragment>
  #include <map_fragment>
  #include <color_fragment>
  #include <alphamap_fragment>
  #include <alphatest_fragment>
  #include <normal_fragment_begin>
  #include <normal_fragment_maps>

  vec3 viewDir = normalize( vViewPosition );
  vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
  vec3 y = cross( viewDir, x );
  vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;

  #ifdef USE_MATCAP

    vec4 matcapColor = texture2D( matcap, uv );

  #else

    vec4 matcapColor = vec4( 1.0 );

  #endif

  vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;

  // Custom start
  gl_FragColor = vec4(outgoingLight, diffuseColor.a);
  // Custom end

  #include <premultiplied_alpha_fragment>
  #include <tonemapping_fragment>
  #include <encodings_fragment>
  #include <fog_fragment>

  // gl_FragColor = vec4(vUv.y, 0.0, 0.0, 1.0);
}
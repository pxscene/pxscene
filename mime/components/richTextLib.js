px.import({
  utils: 'utils.js',
}).then(function importsAreReady(imports) {
  var _eventEmitter = imports.utils._eventEmitter;
(function (f) {
  module.exports = f();
})(function () {
  var define, module, exports;
  return (function () {
    function r(e, n, t) {
      function o(i, f) {
        if (!n[i]) {
          if (!e[i]) {
            var c = "function" == typeof require && require;
            if (!f && c) {
              return c(i, !0);
            }
            if (u) {
              return u(i, !0);
            }
            var a = new Error("Cannot find module '" + i + "'");
            throw a.code = "MODULE_NOT_FOUND", a
          }
          var p = n[i] = { exports: {} };
          e[i][0].call(p.exports, function (r) {
            var n = e[i][1][r];
            return o(n || r)
          }, p, p.exports, r, e, n, t)
        }
        return n[i].exports
      }

      for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) o(t[i]);
      return o
    }

    return r
  })()({
    1: [function (require, module, exports) {
      /* MIT license */
      var cssKeywords = require('color-name');

// NOTE: conversions should only return primitive values (i.e. arrays, or
//       values that give correct `typeof` results).
//       do not use box values types (i.e. Number(), String(), etc.)

      var reverseKeywords = {};
      for (var key in cssKeywords) {
        if (cssKeywords.hasOwnProperty(key)) {
          reverseKeywords[cssKeywords[key]] = key;
        }
      }

      var convert = module.exports = {
        rgb: { channels: 3, labels: 'rgb' },
        hsl: { channels: 3, labels: 'hsl' },
        hsv: { channels: 3, labels: 'hsv' },
        hwb: { channels: 3, labels: 'hwb' },
        cmyk: { channels: 4, labels: 'cmyk' },
        xyz: { channels: 3, labels: 'xyz' },
        lab: { channels: 3, labels: 'lab' },
        lch: { channels: 3, labels: 'lch' },
        hex: { channels: 1, labels: ['hex'] },
        keyword: { channels: 1, labels: ['keyword'] },
        ansi16: { channels: 1, labels: ['ansi16'] },
        ansi256: { channels: 1, labels: ['ansi256'] },
        hcg: { channels: 3, labels: ['h', 'c', 'g'] },
        apple: { channels: 3, labels: ['r16', 'g16', 'b16'] },
        gray: { channels: 1, labels: ['gray'] }
      };

// hide .channels and .labels properties
      for (var model in convert) {
        if (convert.hasOwnProperty(model)) {
          if (!('channels' in convert[model])) {
            throw new Error('missing channels property: ' + model);
          }

          if (!('labels' in convert[model])) {
            throw new Error('missing channel labels property: ' + model);
          }

          if (convert[model].labels.length !== convert[model].channels) {
            throw new Error('channel and label counts mismatch: ' + model);
          }

          var channels = convert[model].channels;
          var labels = convert[model].labels;
          delete convert[model].channels;
          delete convert[model].labels;
          Object.defineProperty(convert[model], 'channels', { value: channels });
          Object.defineProperty(convert[model], 'labels', { value: labels });
        }
      }

      convert.rgb.hsl = function (rgb) {
        var r = rgb[0] / 255;
        var g = rgb[1] / 255;
        var b = rgb[2] / 255;
        var min = Math.min(r, g, b);
        var max = Math.max(r, g, b);
        var delta = max - min;
        var h;
        var s;
        var l;

        if (max === min) {
          h = 0;
        } else if (r === max) {
          h = (g - b) / delta;
        } else if (g === max) {
          h = 2 + (b - r) / delta;
        } else if (b === max) {
          h = 4 + (r - g) / delta;
        }

        h = Math.min(h * 60, 360);

        if (h < 0) {
          h += 360;
        }

        l = (min + max) / 2;

        if (max === min) {
          s = 0;
        } else if (l <= 0.5) {
          s = delta / (max + min);
        } else {
          s = delta / (2 - max - min);
        }

        return [h, s * 100, l * 100];
      };

      convert.rgb.hsv = function (rgb) {
        var rdif;
        var gdif;
        var bdif;
        var h;
        var s;

        var r = rgb[0] / 255;
        var g = rgb[1] / 255;
        var b = rgb[2] / 255;
        var v = Math.max(r, g, b);
        var diff = v - Math.min(r, g, b);
        var diffc = function (c) {
          return (v - c) / 6 / diff + 1 / 2;
        };

        if (diff === 0) {
          h = s = 0;
        } else {
          s = diff / v;
          rdif = diffc(r);
          gdif = diffc(g);
          bdif = diffc(b);

          if (r === v) {
            h = bdif - gdif;
          } else if (g === v) {
            h = (1 / 3) + rdif - bdif;
          } else if (b === v) {
            h = (2 / 3) + gdif - rdif;
          }
          if (h < 0) {
            h += 1;
          } else if (h > 1) {
            h -= 1;
          }
        }

        return [
          h * 360,
          s * 100,
          v * 100
        ];
      };

      convert.rgb.hwb = function (rgb) {
        var r = rgb[0];
        var g = rgb[1];
        var b = rgb[2];
        var h = convert.rgb.hsl(rgb)[0];
        var w = 1 / 255 * Math.min(r, Math.min(g, b));

        b = 1 - 1 / 255 * Math.max(r, Math.max(g, b));

        return [h, w * 100, b * 100];
      };

      convert.rgb.cmyk = function (rgb) {
        var r = rgb[0] / 255;
        var g = rgb[1] / 255;
        var b = rgb[2] / 255;
        var c;
        var m;
        var y;
        var k;

        k = Math.min(1 - r, 1 - g, 1 - b);
        c = (1 - r - k) / (1 - k) || 0;
        m = (1 - g - k) / (1 - k) || 0;
        y = (1 - b - k) / (1 - k) || 0;

        return [c * 100, m * 100, y * 100, k * 100];
      };

      /**
       * See https://en.m.wikipedia.org/wiki/Euclidean_distance#Squared_Euclidean_distance
       * */
      function comparativeDistance(x, y) {
        return (
          Math.pow(x[0] - y[0], 2) +
          Math.pow(x[1] - y[1], 2) +
          Math.pow(x[2] - y[2], 2)
        );
      }

      convert.rgb.keyword = function (rgb) {
        var reversed = reverseKeywords[rgb];
        if (reversed) {
          return reversed;
        }

        var currentClosestDistance = Infinity;
        var currentClosestKeyword;

        for (var keyword in cssKeywords) {
          if (cssKeywords.hasOwnProperty(keyword)) {
            var value = cssKeywords[keyword];

            // Compute comparative distance
            var distance = comparativeDistance(rgb, value);

            // Check if its less, if so set as closest
            if (distance < currentClosestDistance) {
              currentClosestDistance = distance;
              currentClosestKeyword = keyword;
            }
          }
        }

        return currentClosestKeyword;
      };

      convert.keyword.rgb = function (keyword) {
        return cssKeywords[keyword];
      };

      convert.rgb.xyz = function (rgb) {
        var r = rgb[0] / 255;
        var g = rgb[1] / 255;
        var b = rgb[2] / 255;

        // assume sRGB
        r = r > 0.04045 ? Math.pow(((r + 0.055) / 1.055), 2.4) : (r / 12.92);
        g = g > 0.04045 ? Math.pow(((g + 0.055) / 1.055), 2.4) : (g / 12.92);
        b = b > 0.04045 ? Math.pow(((b + 0.055) / 1.055), 2.4) : (b / 12.92);

        var x = (r * 0.4124) + (g * 0.3576) + (b * 0.1805);
        var y = (r * 0.2126) + (g * 0.7152) + (b * 0.0722);
        var z = (r * 0.0193) + (g * 0.1192) + (b * 0.9505);

        return [x * 100, y * 100, z * 100];
      };

      convert.rgb.lab = function (rgb) {
        var xyz = convert.rgb.xyz(rgb);
        var x = xyz[0];
        var y = xyz[1];
        var z = xyz[2];
        var l;
        var a;
        var b;

        x /= 95.047;
        y /= 100;
        z /= 108.883;

        x = x > 0.008856 ? Math.pow(x, 1 / 3) : (7.787 * x) + (16 / 116);
        y = y > 0.008856 ? Math.pow(y, 1 / 3) : (7.787 * y) + (16 / 116);
        z = z > 0.008856 ? Math.pow(z, 1 / 3) : (7.787 * z) + (16 / 116);

        l = (116 * y) - 16;
        a = 500 * (x - y);
        b = 200 * (y - z);

        return [l, a, b];
      };

      convert.hsl.rgb = function (hsl) {
        var h = hsl[0] / 360;
        var s = hsl[1] / 100;
        var l = hsl[2] / 100;
        var t1;
        var t2;
        var t3;
        var rgb;
        var val;

        if (s === 0) {
          val = l * 255;
          return [val, val, val];
        }

        if (l < 0.5) {
          t2 = l * (1 + s);
        } else {
          t2 = l + s - l * s;
        }

        t1 = 2 * l - t2;

        rgb = [0, 0, 0];
        for (var i = 0; i < 3; i++) {
          t3 = h + 1 / 3 * -(i - 1);
          if (t3 < 0) {
            t3++;
          }
          if (t3 > 1) {
            t3--;
          }

          if (6 * t3 < 1) {
            val = t1 + (t2 - t1) * 6 * t3;
          } else if (2 * t3 < 1) {
            val = t2;
          } else if (3 * t3 < 2) {
            val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
          } else {
            val = t1;
          }

          rgb[i] = val * 255;
        }

        return rgb;
      };

      convert.hsl.hsv = function (hsl) {
        var h = hsl[0];
        var s = hsl[1] / 100;
        var l = hsl[2] / 100;
        var smin = s;
        var lmin = Math.max(l, 0.01);
        var sv;
        var v;

        l *= 2;
        s *= (l <= 1) ? l : 2 - l;
        smin *= lmin <= 1 ? lmin : 2 - lmin;
        v = (l + s) / 2;
        sv = l === 0 ? (2 * smin) / (lmin + smin) : (2 * s) / (l + s);

        return [h, sv * 100, v * 100];
      };

      convert.hsv.rgb = function (hsv) {
        var h = hsv[0] / 60;
        var s = hsv[1] / 100;
        var v = hsv[2] / 100;
        var hi = Math.floor(h) % 6;

        var f = h - Math.floor(h);
        var p = 255 * v * (1 - s);
        var q = 255 * v * (1 - (s * f));
        var t = 255 * v * (1 - (s * (1 - f)));
        v *= 255;

        switch (hi) {
          case 0:
            return [v, t, p];
          case 1:
            return [q, v, p];
          case 2:
            return [p, v, t];
          case 3:
            return [p, q, v];
          case 4:
            return [t, p, v];
          case 5:
            return [v, p, q];
        }
      };

      convert.hsv.hsl = function (hsv) {
        var h = hsv[0];
        var s = hsv[1] / 100;
        var v = hsv[2] / 100;
        var vmin = Math.max(v, 0.01);
        var lmin;
        var sl;
        var l;

        l = (2 - s) * v;
        lmin = (2 - s) * vmin;
        sl = s * vmin;
        sl /= (lmin <= 1) ? lmin : 2 - lmin;
        sl = sl || 0;
        l /= 2;

        return [h, sl * 100, l * 100];
      };

// http://dev.w3.org/csswg/css-color/#hwb-to-rgb
      convert.hwb.rgb = function (hwb) {
        var h = hwb[0] / 360;
        var wh = hwb[1] / 100;
        var bl = hwb[2] / 100;
        var ratio = wh + bl;
        var i;
        var v;
        var f;
        var n;

        // wh + bl cant be > 1
        if (ratio > 1) {
          wh /= ratio;
          bl /= ratio;
        }

        i = Math.floor(6 * h);
        v = 1 - bl;
        f = 6 * h - i;

        if ((i & 0x01) !== 0) {
          f = 1 - f;
        }

        n = wh + f * (v - wh); // linear interpolation

        var r;
        var g;
        var b;
        switch (i) {
          default:
          case 6:
          case 0:
            r = v;
            g = n;
            b = wh;
            break;
          case 1:
            r = n;
            g = v;
            b = wh;
            break;
          case 2:
            r = wh;
            g = v;
            b = n;
            break;
          case 3:
            r = wh;
            g = n;
            b = v;
            break;
          case 4:
            r = n;
            g = wh;
            b = v;
            break;
          case 5:
            r = v;
            g = wh;
            b = n;
            break;
        }

        return [r * 255, g * 255, b * 255];
      };

      convert.cmyk.rgb = function (cmyk) {
        var c = cmyk[0] / 100;
        var m = cmyk[1] / 100;
        var y = cmyk[2] / 100;
        var k = cmyk[3] / 100;
        var r;
        var g;
        var b;

        r = 1 - Math.min(1, c * (1 - k) + k);
        g = 1 - Math.min(1, m * (1 - k) + k);
        b = 1 - Math.min(1, y * (1 - k) + k);

        return [r * 255, g * 255, b * 255];
      };

      convert.xyz.rgb = function (xyz) {
        var x = xyz[0] / 100;
        var y = xyz[1] / 100;
        var z = xyz[2] / 100;
        var r;
        var g;
        var b;

        r = (x * 3.2406) + (y * -1.5372) + (z * -0.4986);
        g = (x * -0.9689) + (y * 1.8758) + (z * 0.0415);
        b = (x * 0.0557) + (y * -0.2040) + (z * 1.0570);

        // assume sRGB
        r = r > 0.0031308
          ? ((1.055 * Math.pow(r, 1.0 / 2.4)) - 0.055)
          : r * 12.92;

        g = g > 0.0031308
          ? ((1.055 * Math.pow(g, 1.0 / 2.4)) - 0.055)
          : g * 12.92;

        b = b > 0.0031308
          ? ((1.055 * Math.pow(b, 1.0 / 2.4)) - 0.055)
          : b * 12.92;

        r = Math.min(Math.max(0, r), 1);
        g = Math.min(Math.max(0, g), 1);
        b = Math.min(Math.max(0, b), 1);

        return [r * 255, g * 255, b * 255];
      };

      convert.xyz.lab = function (xyz) {
        var x = xyz[0];
        var y = xyz[1];
        var z = xyz[2];
        var l;
        var a;
        var b;

        x /= 95.047;
        y /= 100;
        z /= 108.883;

        x = x > 0.008856 ? Math.pow(x, 1 / 3) : (7.787 * x) + (16 / 116);
        y = y > 0.008856 ? Math.pow(y, 1 / 3) : (7.787 * y) + (16 / 116);
        z = z > 0.008856 ? Math.pow(z, 1 / 3) : (7.787 * z) + (16 / 116);

        l = (116 * y) - 16;
        a = 500 * (x - y);
        b = 200 * (y - z);

        return [l, a, b];
      };

      convert.lab.xyz = function (lab) {
        var l = lab[0];
        var a = lab[1];
        var b = lab[2];
        var x;
        var y;
        var z;

        y = (l + 16) / 116;
        x = a / 500 + y;
        z = y - b / 200;

        var y2 = Math.pow(y, 3);
        var x2 = Math.pow(x, 3);
        var z2 = Math.pow(z, 3);
        y = y2 > 0.008856 ? y2 : (y - 16 / 116) / 7.787;
        x = x2 > 0.008856 ? x2 : (x - 16 / 116) / 7.787;
        z = z2 > 0.008856 ? z2 : (z - 16 / 116) / 7.787;

        x *= 95.047;
        y *= 100;
        z *= 108.883;

        return [x, y, z];
      };

      convert.lab.lch = function (lab) {
        var l = lab[0];
        var a = lab[1];
        var b = lab[2];
        var hr;
        var h;
        var c;

        hr = Math.atan2(b, a);
        h = hr * 360 / 2 / Math.PI;

        if (h < 0) {
          h += 360;
        }

        c = Math.sqrt(a * a + b * b);

        return [l, c, h];
      };

      convert.lch.lab = function (lch) {
        var l = lch[0];
        var c = lch[1];
        var h = lch[2];
        var a;
        var b;
        var hr;

        hr = h / 360 * 2 * Math.PI;
        a = c * Math.cos(hr);
        b = c * Math.sin(hr);

        return [l, a, b];
      };

      convert.rgb.ansi16 = function (args) {
        var r = args[0];
        var g = args[1];
        var b = args[2];
        var value = 1 in arguments ? arguments[1] : convert.rgb.hsv(args)[2]; // hsv -> ansi16 optimization

        value = Math.round(value / 50);

        if (value === 0) {
          return 30;
        }

        var ansi = 30
          + ((Math.round(b / 255) << 2)
            | (Math.round(g / 255) << 1)
            | Math.round(r / 255));

        if (value === 2) {
          ansi += 60;
        }

        return ansi;
      };

      convert.hsv.ansi16 = function (args) {
        // optimization here; we already know the value and don't need to get
        // it converted for us.
        return convert.rgb.ansi16(convert.hsv.rgb(args), args[2]);
      };

      convert.rgb.ansi256 = function (args) {
        var r = args[0];
        var g = args[1];
        var b = args[2];

        // we use the extended greyscale palette here, with the exception of
        // black and white. normal palette only has 4 greyscale shades.
        if (r === g && g === b) {
          if (r < 8) {
            return 16;
          }

          if (r > 248) {
            return 231;
          }

          return Math.round(((r - 8) / 247) * 24) + 232;
        }

        var ansi = 16
          + (36 * Math.round(r / 255 * 5))
          + (6 * Math.round(g / 255 * 5))
          + Math.round(b / 255 * 5);

        return ansi;
      };

      convert.ansi16.rgb = function (args) {
        var color = args % 10;

        // handle greyscale
        if (color === 0 || color === 7) {
          if (args > 50) {
            color += 3.5;
          }

          color = color / 10.5 * 255;

          return [color, color, color];
        }

        var mult = (~~(args > 50) + 1) * 0.5;
        var r = ((color & 1) * mult) * 255;
        var g = (((color >> 1) & 1) * mult) * 255;
        var b = (((color >> 2) & 1) * mult) * 255;

        return [r, g, b];
      };

      convert.ansi256.rgb = function (args) {
        // handle greyscale
        if (args >= 232) {
          var c = (args - 232) * 10 + 8;
          return [c, c, c];
        }

        args -= 16;

        var rem;
        var r = Math.floor(args / 36) / 5 * 255;
        var g = Math.floor((rem = args % 36) / 6) / 5 * 255;
        var b = (rem % 6) / 5 * 255;

        return [r, g, b];
      };

      convert.rgb.hex = function (args) {
        var integer = ((Math.round(args[0]) & 0xFF) << 16)
          + ((Math.round(args[1]) & 0xFF) << 8)
          + (Math.round(args[2]) & 0xFF);

        var string = integer.toString(16).toUpperCase();
        return '000000'.substring(string.length) + string;
      };

      convert.hex.rgb = function (args) {
        var match = args.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
        if (!match) {
          return [0, 0, 0];
        }

        var colorString = match[0];

        if (match[0].length === 3) {
          colorString = colorString.split('').map(function (char) {
            return char + char;
          }).join('');
        }

        var integer = parseInt(colorString, 16);
        var r = (integer >> 16) & 0xFF;
        var g = (integer >> 8) & 0xFF;
        var b = integer & 0xFF;

        return [r, g, b];
      };

      convert.rgb.hcg = function (rgb) {
        var r = rgb[0] / 255;
        var g = rgb[1] / 255;
        var b = rgb[2] / 255;
        var max = Math.max(Math.max(r, g), b);
        var min = Math.min(Math.min(r, g), b);
        var chroma = (max - min);
        var grayscale;
        var hue;

        if (chroma < 1) {
          grayscale = min / (1 - chroma);
        } else {
          grayscale = 0;
        }

        if (chroma <= 0) {
          hue = 0;
        } else if (max === r) {
          hue = ((g - b) / chroma) % 6;
        } else if (max === g) {
          hue = 2 + (b - r) / chroma;
        } else {
          hue = 4 + (r - g) / chroma + 4;
        }

        hue /= 6;
        hue %= 1;

        return [hue * 360, chroma * 100, grayscale * 100];
      };

      convert.hsl.hcg = function (hsl) {
        var s = hsl[1] / 100;
        var l = hsl[2] / 100;
        var c = 1;
        var f = 0;

        if (l < 0.5) {
          c = 2.0 * s * l;
        } else {
          c = 2.0 * s * (1.0 - l);
        }

        if (c < 1.0) {
          f = (l - 0.5 * c) / (1.0 - c);
        }

        return [hsl[0], c * 100, f * 100];
      };

      convert.hsv.hcg = function (hsv) {
        var s = hsv[1] / 100;
        var v = hsv[2] / 100;

        var c = s * v;
        var f = 0;

        if (c < 1.0) {
          f = (v - c) / (1 - c);
        }

        return [hsv[0], c * 100, f * 100];
      };

      convert.hcg.rgb = function (hcg) {
        var h = hcg[0] / 360;
        var c = hcg[1] / 100;
        var g = hcg[2] / 100;

        if (c === 0.0) {
          return [g * 255, g * 255, g * 255];
        }

        var pure = [0, 0, 0];
        var hi = (h % 1) * 6;
        var v = hi % 1;
        var w = 1 - v;
        var mg = 0;

        switch (Math.floor(hi)) {
          case 0:
            pure[0] = 1;
            pure[1] = v;
            pure[2] = 0;
            break;
          case 1:
            pure[0] = w;
            pure[1] = 1;
            pure[2] = 0;
            break;
          case 2:
            pure[0] = 0;
            pure[1] = 1;
            pure[2] = v;
            break;
          case 3:
            pure[0] = 0;
            pure[1] = w;
            pure[2] = 1;
            break;
          case 4:
            pure[0] = v;
            pure[1] = 0;
            pure[2] = 1;
            break;
          default:
            pure[0] = 1;
            pure[1] = 0;
            pure[2] = w;
        }

        mg = (1.0 - c) * g;

        return [
          (c * pure[0] + mg) * 255,
          (c * pure[1] + mg) * 255,
          (c * pure[2] + mg) * 255
        ];
      };

      convert.hcg.hsv = function (hcg) {
        var c = hcg[1] / 100;
        var g = hcg[2] / 100;

        var v = c + g * (1.0 - c);
        var f = 0;

        if (v > 0.0) {
          f = c / v;
        }

        return [hcg[0], f * 100, v * 100];
      };

      convert.hcg.hsl = function (hcg) {
        var c = hcg[1] / 100;
        var g = hcg[2] / 100;

        var l = g * (1.0 - c) + 0.5 * c;
        var s = 0;

        if (l > 0.0 && l < 0.5) {
          s = c / (2 * l);
        } else if (l >= 0.5 && l < 1.0) {
          s = c / (2 * (1 - l));
        }

        return [hcg[0], s * 100, l * 100];
      };

      convert.hcg.hwb = function (hcg) {
        var c = hcg[1] / 100;
        var g = hcg[2] / 100;
        var v = c + g * (1.0 - c);
        return [hcg[0], (v - c) * 100, (1 - v) * 100];
      };

      convert.hwb.hcg = function (hwb) {
        var w = hwb[1] / 100;
        var b = hwb[2] / 100;
        var v = 1 - b;
        var c = v - w;
        var g = 0;

        if (c < 1) {
          g = (v - c) / (1 - c);
        }

        return [hwb[0], c * 100, g * 100];
      };

      convert.apple.rgb = function (apple) {
        return [(apple[0] / 65535) * 255, (apple[1] / 65535) * 255, (apple[2] / 65535) * 255];
      };

      convert.rgb.apple = function (rgb) {
        return [(rgb[0] / 255) * 65535, (rgb[1] / 255) * 65535, (rgb[2] / 255) * 65535];
      };

      convert.gray.rgb = function (args) {
        return [args[0] / 100 * 255, args[0] / 100 * 255, args[0] / 100 * 255];
      };

      convert.gray.hsl = convert.gray.hsv = function (args) {
        return [0, 0, args[0]];
      };

      convert.gray.hwb = function (gray) {
        return [0, 100, gray[0]];
      };

      convert.gray.cmyk = function (gray) {
        return [0, 0, 0, gray[0]];
      };

      convert.gray.lab = function (gray) {
        return [gray[0], 0, 0];
      };

      convert.gray.hex = function (gray) {
        var val = Math.round(gray[0] / 100 * 255) & 0xFF;
        var integer = (val << 16) + (val << 8) + val;

        var string = integer.toString(16).toUpperCase();
        return '000000'.substring(string.length) + string;
      };

      convert.rgb.gray = function (rgb) {
        var val = (rgb[0] + rgb[1] + rgb[2]) / 3;
        return [val / 255 * 100];
      };

    }, { "color-name": 4 }],
    2: [function (require, module, exports) {
      var conversions = require('./conversions');
      var route = require('./route');

      var convert = {};

      var models = Object.keys(conversions);

      function wrapRaw(fn) {
        var wrappedFn = function (args) {
          if (args === undefined || args === null) {
            return args;
          }

          if (arguments.length > 1) {
            args = Array.prototype.slice.call(arguments);
          }

          return fn(args);
        };

        // preserve .conversion property if there is one
        if ('conversion' in fn) {
          wrappedFn.conversion = fn.conversion;
        }

        return wrappedFn;
      }

      function wrapRounded(fn) {
        var wrappedFn = function (args) {
          if (args === undefined || args === null) {
            return args;
          }

          if (arguments.length > 1) {
            args = Array.prototype.slice.call(arguments);
          }

          var result = fn(args);

          // we're assuming the result is an array here.
          // see notice in conversions.js; don't use box types
          // in conversion functions.
          if (typeof result === 'object') {
            for (var len = result.length, i = 0; i < len; i++) {
              result[i] = Math.round(result[i]);
            }
          }

          return result;
        };

        // preserve .conversion property if there is one
        if ('conversion' in fn) {
          wrappedFn.conversion = fn.conversion;
        }

        return wrappedFn;
      }

      models.forEach(function (fromModel) {
        convert[fromModel] = {};

        Object.defineProperty(convert[fromModel], 'channels', { value: conversions[fromModel].channels });
        Object.defineProperty(convert[fromModel], 'labels', { value: conversions[fromModel].labels });

        var routes = route(fromModel);
        var routeModels = Object.keys(routes);

        routeModels.forEach(function (toModel) {
          var fn = routes[toModel];

          convert[fromModel][toModel] = wrapRounded(fn);
          convert[fromModel][toModel].raw = wrapRaw(fn);
        });
      });

      module.exports = convert;

    }, { "./conversions": 1, "./route": 3 }],
    3: [function (require, module, exports) {
      var conversions = require('./conversions');

      /*
	this function routes a model to all other models.

	all functions that are routed have a property `.conversion` attached
	to the returned synthetic function. This property is an array
	of strings, each with the steps in between the 'from' and 'to'
	color models (inclusive).

	conversions that are not possible simply are not included.
*/

      function buildGraph() {
        var graph = {};
        // https://jsperf.com/object-keys-vs-for-in-with-closure/3
        var models = Object.keys(conversions);

        for (var len = models.length, i = 0; i < len; i++) {
          graph[models[i]] = {
            // http://jsperf.com/1-vs-infinity
            // micro-opt, but this is simple.
            distance: -1,
            parent: null
          };
        }

        return graph;
      }

// https://en.wikipedia.org/wiki/Breadth-first_search
      function deriveBFS(fromModel) {
        var graph = buildGraph();
        var queue = [fromModel]; // unshift -> queue -> pop

        graph[fromModel].distance = 0;

        while (queue.length) {
          var current = queue.pop();
          var adjacents = Object.keys(conversions[current]);

          for (var len = adjacents.length, i = 0; i < len; i++) {
            var adjacent = adjacents[i];
            var node = graph[adjacent];

            if (node.distance === -1) {
              node.distance = graph[current].distance + 1;
              node.parent = current;
              queue.unshift(adjacent);
            }
          }
        }

        return graph;
      }

      function link(from, to) {
        return function (args) {
          return to(from(args));
        };
      }

      function wrapConversion(toModel, graph) {
        var path = [graph[toModel].parent, toModel];
        var fn = conversions[graph[toModel].parent][toModel];

        var cur = graph[toModel].parent;
        while (graph[cur].parent) {
          path.unshift(graph[cur].parent);
          fn = link(conversions[graph[cur].parent][cur], fn);
          cur = graph[cur].parent;
        }

        fn.conversion = path;
        return fn;
      }

      module.exports = function (fromModel) {
        var graph = deriveBFS(fromModel);
        var conversion = {};

        var models = Object.keys(graph);
        for (var len = models.length, i = 0; i < len; i++) {
          var toModel = models[i];
          var node = graph[toModel];

          if (node.parent === null) {
            // no possible conversion, or this node is the source model.
            continue;
          }

          conversion[toModel] = wrapConversion(toModel, graph);
        }

        return conversion;
      };


    }, { "./conversions": 1 }],
    4: [function (require, module, exports) {
      'use strict'

      module.exports = {
        "aliceblue": [240, 248, 255],
        "antiquewhite": [250, 235, 215],
        "aqua": [0, 255, 255],
        "aquamarine": [127, 255, 212],
        "azure": [240, 255, 255],
        "beige": [245, 245, 220],
        "bisque": [255, 228, 196],
        "black": [0, 0, 0],
        "blanchedalmond": [255, 235, 205],
        "blue": [0, 0, 255],
        "blueviolet": [138, 43, 226],
        "brown": [165, 42, 42],
        "burlywood": [222, 184, 135],
        "cadetblue": [95, 158, 160],
        "chartreuse": [127, 255, 0],
        "chocolate": [210, 105, 30],
        "coral": [255, 127, 80],
        "cornflowerblue": [100, 149, 237],
        "cornsilk": [255, 248, 220],
        "crimson": [220, 20, 60],
        "cyan": [0, 255, 255],
        "darkblue": [0, 0, 139],
        "darkcyan": [0, 139, 139],
        "darkgoldenrod": [184, 134, 11],
        "darkgray": [169, 169, 169],
        "darkgreen": [0, 100, 0],
        "darkgrey": [169, 169, 169],
        "darkkhaki": [189, 183, 107],
        "darkmagenta": [139, 0, 139],
        "darkolivegreen": [85, 107, 47],
        "darkorange": [255, 140, 0],
        "darkorchid": [153, 50, 204],
        "darkred": [139, 0, 0],
        "darksalmon": [233, 150, 122],
        "darkseagreen": [143, 188, 143],
        "darkslateblue": [72, 61, 139],
        "darkslategray": [47, 79, 79],
        "darkslategrey": [47, 79, 79],
        "darkturquoise": [0, 206, 209],
        "darkviolet": [148, 0, 211],
        "deeppink": [255, 20, 147],
        "deepskyblue": [0, 191, 255],
        "dimgray": [105, 105, 105],
        "dimgrey": [105, 105, 105],
        "dodgerblue": [30, 144, 255],
        "firebrick": [178, 34, 34],
        "floralwhite": [255, 250, 240],
        "forestgreen": [34, 139, 34],
        "fuchsia": [255, 0, 255],
        "gainsboro": [220, 220, 220],
        "ghostwhite": [248, 248, 255],
        "gold": [255, 215, 0],
        "goldenrod": [218, 165, 32],
        "gray": [128, 128, 128],
        "green": [0, 128, 0],
        "greenyellow": [173, 255, 47],
        "grey": [128, 128, 128],
        "honeydew": [240, 255, 240],
        "hotpink": [255, 105, 180],
        "indianred": [205, 92, 92],
        "indigo": [75, 0, 130],
        "ivory": [255, 255, 240],
        "khaki": [240, 230, 140],
        "lavender": [230, 230, 250],
        "lavenderblush": [255, 240, 245],
        "lawngreen": [124, 252, 0],
        "lemonchiffon": [255, 250, 205],
        "lightblue": [173, 216, 230],
        "lightcoral": [240, 128, 128],
        "lightcyan": [224, 255, 255],
        "lightgoldenrodyellow": [250, 250, 210],
        "lightgray": [211, 211, 211],
        "lightgreen": [144, 238, 144],
        "lightgrey": [211, 211, 211],
        "lightpink": [255, 182, 193],
        "lightsalmon": [255, 160, 122],
        "lightseagreen": [32, 178, 170],
        "lightskyblue": [135, 206, 250],
        "lightslategray": [119, 136, 153],
        "lightslategrey": [119, 136, 153],
        "lightsteelblue": [176, 196, 222],
        "lightyellow": [255, 255, 224],
        "lime": [0, 255, 0],
        "limegreen": [50, 205, 50],
        "linen": [250, 240, 230],
        "magenta": [255, 0, 255],
        "maroon": [128, 0, 0],
        "mediumaquamarine": [102, 205, 170],
        "mediumblue": [0, 0, 205],
        "mediumorchid": [186, 85, 211],
        "mediumpurple": [147, 112, 219],
        "mediumseagreen": [60, 179, 113],
        "mediumslateblue": [123, 104, 238],
        "mediumspringgreen": [0, 250, 154],
        "mediumturquoise": [72, 209, 204],
        "mediumvioletred": [199, 21, 133],
        "midnightblue": [25, 25, 112],
        "mintcream": [245, 255, 250],
        "mistyrose": [255, 228, 225],
        "moccasin": [255, 228, 181],
        "navajowhite": [255, 222, 173],
        "navy": [0, 0, 128],
        "oldlace": [253, 245, 230],
        "olive": [128, 128, 0],
        "olivedrab": [107, 142, 35],
        "orange": [255, 165, 0],
        "orangered": [255, 69, 0],
        "orchid": [218, 112, 214],
        "palegoldenrod": [238, 232, 170],
        "palegreen": [152, 251, 152],
        "paleturquoise": [175, 238, 238],
        "palevioletred": [219, 112, 147],
        "papayawhip": [255, 239, 213],
        "peachpuff": [255, 218, 185],
        "peru": [205, 133, 63],
        "pink": [255, 192, 203],
        "plum": [221, 160, 221],
        "powderblue": [176, 224, 230],
        "purple": [128, 0, 128],
        "rebeccapurple": [102, 51, 153],
        "red": [255, 0, 0],
        "rosybrown": [188, 143, 143],
        "royalblue": [65, 105, 225],
        "saddlebrown": [139, 69, 19],
        "salmon": [250, 128, 114],
        "sandybrown": [244, 164, 96],
        "seagreen": [46, 139, 87],
        "seashell": [255, 245, 238],
        "sienna": [160, 82, 45],
        "silver": [192, 192, 192],
        "skyblue": [135, 206, 235],
        "slateblue": [106, 90, 205],
        "slategray": [112, 128, 144],
        "slategrey": [112, 128, 144],
        "snow": [255, 250, 250],
        "springgreen": [0, 255, 127],
        "steelblue": [70, 130, 180],
        "tan": [210, 180, 140],
        "teal": [0, 128, 128],
        "thistle": [216, 191, 216],
        "tomato": [255, 99, 71],
        "turquoise": [64, 224, 208],
        "violet": [238, 130, 238],
        "wheat": [245, 222, 179],
        "white": [255, 255, 255],
        "whitesmoke": [245, 245, 245],
        "yellow": [255, 255, 0],
        "yellowgreen": [154, 205, 50]
      };

    }, {}],
    5: [function (require, module, exports) {
      /* MIT license */
      var colorNames = require('color-name');
      var swizzle = require('simple-swizzle');

      var reverseNames = {};

// create a list of reverse color names
      for (var name in colorNames) {
        if (colorNames.hasOwnProperty(name)) {
          reverseNames[colorNames[name]] = name;
        }
      }

      var cs = module.exports = {
        to: {},
        get: {}
      };

      cs.get = function (string) {
        var prefix = string.substring(0, 3).toLowerCase();
        var val;
        var model;
        switch (prefix) {
          case 'hsl':
            val = cs.get.hsl(string);
            model = 'hsl';
            break;
          case 'hwb':
            val = cs.get.hwb(string);
            model = 'hwb';
            break;
          default:
            val = cs.get.rgb(string);
            model = 'rgb';
            break;
        }

        if (!val) {
          return null;
        }

        return { model: model, value: val };
      };

      cs.get.rgb = function (string) {
        if (!string) {
          return null;
        }

        var abbr = /^#([a-f0-9]{3,4})$/i;
        var hex = /^#([a-f0-9]{6})([a-f0-9]{2})?$/i;
        var rgba = /^rgba?\(\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
        var per = /^rgba?\(\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
        var keyword = /(\D+)/;

        var rgb = [0, 0, 0, 1];
        var match;
        var i;
        var hexAlpha;

        if (match = string.match(hex)) {
          hexAlpha = match[2];
          match = match[1];

          for (i = 0; i < 3; i++) {
            // https://jsperf.com/slice-vs-substr-vs-substring-methods-long-string/19
            var i2 = i * 2;
            rgb[i] = parseInt(match.slice(i2, i2 + 2), 16);
          }

          if (hexAlpha) {
            rgb[3] = Math.round((parseInt(hexAlpha, 16) / 255) * 100) / 100;
          }
        } else if (match = string.match(abbr)) {
          match = match[1];
          hexAlpha = match[3];

          for (i = 0; i < 3; i++) {
            rgb[i] = parseInt(match[i] + match[i], 16);
          }

          if (hexAlpha) {
            rgb[3] = Math.round((parseInt(hexAlpha + hexAlpha, 16) / 255) * 100) / 100;
          }
        } else if (match = string.match(rgba)) {
          for (i = 0; i < 3; i++) {
            rgb[i] = parseInt(match[i + 1], 0);
          }

          if (match[4]) {
            rgb[3] = parseFloat(match[4]);
          }
        } else if (match = string.match(per)) {
          for (i = 0; i < 3; i++) {
            rgb[i] = Math.round(parseFloat(match[i + 1]) * 2.55);
          }

          if (match[4]) {
            rgb[3] = parseFloat(match[4]);
          }
        } else if (match = string.match(keyword)) {
          if (match[1] === 'transparent') {
            return [0, 0, 0, 0];
          }

          rgb = colorNames[match[1]];

          if (!rgb) {
            return null;
          }

          rgb[3] = 1;

          return rgb;
        } else {
          return null;
        }

        for (i = 0; i < 3; i++) {
          rgb[i] = clamp(rgb[i], 0, 255);
        }
        rgb[3] = clamp(rgb[3], 0, 1);

        return rgb;
      };

      cs.get.hsl = function (string) {
        if (!string) {
          return null;
        }

        var hsl = /^hsla?\(\s*([+-]?(?:\d*\.)?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
        var match = string.match(hsl);

        if (match) {
          var alpha = parseFloat(match[4]);
          var h = (parseFloat(match[1]) + 360) % 360;
          var s = clamp(parseFloat(match[2]), 0, 100);
          var l = clamp(parseFloat(match[3]), 0, 100);
          var a = clamp(isNaN(alpha) ? 1 : alpha, 0, 1);

          return [h, s, l, a];
        }

        return null;
      };

      cs.get.hwb = function (string) {
        if (!string) {
          return null;
        }

        var hwb = /^hwb\(\s*([+-]?\d*[\.]?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
        var match = string.match(hwb);

        if (match) {
          var alpha = parseFloat(match[4]);
          var h = ((parseFloat(match[1]) % 360) + 360) % 360;
          var w = clamp(parseFloat(match[2]), 0, 100);
          var b = clamp(parseFloat(match[3]), 0, 100);
          var a = clamp(isNaN(alpha) ? 1 : alpha, 0, 1);
          return [h, w, b, a];
        }

        return null;
      };

      cs.to.hex = function () {
        var rgba = swizzle(arguments);

        return (
          '#' +
          hexDouble(rgba[0]) +
          hexDouble(rgba[1]) +
          hexDouble(rgba[2]) +
          (rgba[3] < 1
            ? (hexDouble(Math.round(rgba[3] * 255)))
            : '')
        );
      };

      cs.to.rgb = function () {
        var rgba = swizzle(arguments);

        return rgba.length < 4 || rgba[3] === 1
          ? 'rgb(' + Math.round(rgba[0]) + ', ' + Math.round(rgba[1]) + ', ' + Math.round(rgba[2]) + ')'
          : 'rgba(' + Math.round(rgba[0]) + ', ' + Math.round(rgba[1]) + ', ' + Math.round(rgba[2]) + ', ' + rgba[3] + ')';
      };

      cs.to.rgb.percent = function () {
        var rgba = swizzle(arguments);

        var r = Math.round(rgba[0] / 255 * 100);
        var g = Math.round(rgba[1] / 255 * 100);
        var b = Math.round(rgba[2] / 255 * 100);

        return rgba.length < 4 || rgba[3] === 1
          ? 'rgb(' + r + '%, ' + g + '%, ' + b + '%)'
          : 'rgba(' + r + '%, ' + g + '%, ' + b + '%, ' + rgba[3] + ')';
      };

      cs.to.hsl = function () {
        var hsla = swizzle(arguments);
        return hsla.length < 4 || hsla[3] === 1
          ? 'hsl(' + hsla[0] + ', ' + hsla[1] + '%, ' + hsla[2] + '%)'
          : 'hsla(' + hsla[0] + ', ' + hsla[1] + '%, ' + hsla[2] + '%, ' + hsla[3] + ')';
      };

// hwb is a bit different than rgb(a) & hsl(a) since there is no alpha specific syntax
// (hwb have alpha optional & 1 is default value)
      cs.to.hwb = function () {
        var hwba = swizzle(arguments);

        var a = '';
        if (hwba.length >= 4 && hwba[3] !== 1) {
          a = ', ' + hwba[3];
        }

        return 'hwb(' + hwba[0] + ', ' + hwba[1] + '%, ' + hwba[2] + '%' + a + ')';
      };

      cs.to.keyword = function (rgb) {
        return reverseNames[rgb.slice(0, 3)];
      };

// helpers
      function clamp(num, min, max) {
        return Math.min(Math.max(min, num), max);
      }

      function hexDouble(num) {
        var str = num.toString(16).toUpperCase();
        return (str.length < 2) ? '0' + str : str;
      }

    }, { "color-name": 4, "simple-swizzle": 45 }],
    6: [function (require, module, exports) {
      'use strict';

      var colorString = require('color-string');
      var convert = require('color-convert');

      var _slice = [].slice;

      var skippedModels = [
        // to be honest, I don't really feel like keyword belongs in color convert, but eh.
        'keyword',

        // gray conflicts with some method names, and has its own method defined.
        'gray',

        // shouldn't really be in color-convert either...
        'hex'
      ];

      var hashedModelKeys = {};
      Object.keys(convert).forEach(function (model) {
        hashedModelKeys[_slice.call(convert[model].labels).sort().join('')] = model;
      });

      var limiters = {};

      function Color(obj, model) {
        if (!(this instanceof Color)) {
          return new Color(obj, model);
        }

        if (model && model in skippedModels) {
          model = null;
        }

        if (model && !(model in convert)) {
          throw new Error('Unknown model: ' + model);
        }

        var i;
        var channels;

        if (typeof obj === 'undefined') {
          this.model = 'rgb';
          this.color = [0, 0, 0];
          this.valpha = 1;
        } else if (obj instanceof Color) {
          this.model = obj.model;
          this.color = obj.color.slice();
          this.valpha = obj.valpha;
        } else if (typeof obj === 'string') {
          var result = colorString.get(obj);
          if (result === null) {
            throw new Error('Unable to parse color from string: ' + obj);
          }

          this.model = result.model;
          channels = convert[this.model].channels;
          this.color = result.value.slice(0, channels);
          this.valpha = typeof result.value[channels] === 'number' ? result.value[channels] : 1;
        } else if (obj.length) {
          this.model = model || 'rgb';
          channels = convert[this.model].channels;
          var newArr = _slice.call(obj, 0, channels);
          this.color = zeroArray(newArr, channels);
          this.valpha = typeof obj[channels] === 'number' ? obj[channels] : 1;
        } else if (typeof obj === 'number') {
          // this is always RGB - can be converted later on.
          obj &= 0xFFFFFF;
          this.model = 'rgb';
          this.color = [
            (obj >> 16) & 0xFF,
            (obj >> 8) & 0xFF,
            obj & 0xFF
          ];
          this.valpha = 1;
        } else {
          this.valpha = 1;

          var keys = Object.keys(obj);
          if ('alpha' in obj) {
            keys.splice(keys.indexOf('alpha'), 1);
            this.valpha = typeof obj.alpha === 'number' ? obj.alpha : 0;
          }

          var hashedKeys = keys.sort().join('');
          if (!(hashedKeys in hashedModelKeys)) {
            throw new Error('Unable to parse color from object: ' + JSON.stringify(obj));
          }

          this.model = hashedModelKeys[hashedKeys];

          var labels = convert[this.model].labels;
          var color = [];
          for (i = 0; i < labels.length; i++) {
            color.push(obj[labels[i]]);
          }

          this.color = zeroArray(color);
        }

        // perform limitations (clamping, etc.)
        if (limiters[this.model]) {
          channels = convert[this.model].channels;
          for (i = 0; i < channels; i++) {
            var limit = limiters[this.model][i];
            if (limit) {
              this.color[i] = limit(this.color[i]);
            }
          }
        }

        this.valpha = Math.max(0, Math.min(1, this.valpha));

        if (Object.freeze) {
          Object.freeze(this);
        }
      }

      Color.prototype = {
        toString: function () {
          return this.string();
        },

        toJSON: function () {
          return this[this.model]();
        },

        string: function (places) {
          var self = this.model in colorString.to ? this : this.rgb();
          self = self.round(typeof places === 'number' ? places : 1);
          var args = self.valpha === 1 ? self.color : self.color.concat(this.valpha);
          return colorString.to[self.model](args);
        },

        percentString: function (places) {
          var self = this.rgb().round(typeof places === 'number' ? places : 1);
          var args = self.valpha === 1 ? self.color : self.color.concat(this.valpha);
          return colorString.to.rgb.percent(args);
        },

        array: function () {
          return this.valpha === 1 ? this.color.slice() : this.color.concat(this.valpha);
        },

        object: function () {
          var result = {};
          var channels = convert[this.model].channels;
          var labels = convert[this.model].labels;

          for (var i = 0; i < channels; i++) {
            result[labels[i]] = this.color[i];
          }

          if (this.valpha !== 1) {
            result.alpha = this.valpha;
          }

          return result;
        },

        unitArray: function () {
          var rgb = this.rgb().color;
          rgb[0] /= 255;
          rgb[1] /= 255;
          rgb[2] /= 255;

          if (this.valpha !== 1) {
            rgb.push(this.valpha);
          }

          return rgb;
        },

        unitObject: function () {
          var rgb = this.rgb().object();
          rgb.r /= 255;
          rgb.g /= 255;
          rgb.b /= 255;

          if (this.valpha !== 1) {
            rgb.alpha = this.valpha;
          }

          return rgb;
        },

        round: function (places) {
          places = Math.max(places || 0, 0);
          return new Color(this.color.map(roundToPlace(places)).concat(this.valpha), this.model);
        },

        alpha: function (val) {
          if (arguments.length) {
            return new Color(this.color.concat(Math.max(0, Math.min(1, val))), this.model);
          }

          return this.valpha;
        },

        // rgb
        red: getset('rgb', 0, maxfn(255)),
        green: getset('rgb', 1, maxfn(255)),
        blue: getset('rgb', 2, maxfn(255)),

        hue: getset(['hsl', 'hsv', 'hsl', 'hwb', 'hcg'], 0, function (val) {
          return ((val % 360) + 360) % 360;
        }), // eslint-disable-line brace-style

        saturationl: getset('hsl', 1, maxfn(100)),
        lightness: getset('hsl', 2, maxfn(100)),

        saturationv: getset('hsv', 1, maxfn(100)),
        value: getset('hsv', 2, maxfn(100)),

        chroma: getset('hcg', 1, maxfn(100)),
        gray: getset('hcg', 2, maxfn(100)),

        white: getset('hwb', 1, maxfn(100)),
        wblack: getset('hwb', 2, maxfn(100)),

        cyan: getset('cmyk', 0, maxfn(100)),
        magenta: getset('cmyk', 1, maxfn(100)),
        yellow: getset('cmyk', 2, maxfn(100)),
        black: getset('cmyk', 3, maxfn(100)),

        x: getset('xyz', 0, maxfn(100)),
        y: getset('xyz', 1, maxfn(100)),
        z: getset('xyz', 2, maxfn(100)),

        l: getset('lab', 0, maxfn(100)),
        a: getset('lab', 1),
        b: getset('lab', 2),

        keyword: function (val) {
          if (arguments.length) {
            return new Color(val);
          }

          return convert[this.model].keyword(this.color);
        },

        hex: function (val) {
          if (arguments.length) {
            return new Color(val);
          }

          return colorString.to.hex(this.rgb().round().color);
        },

        rgbNumber: function () {
          var rgb = this.rgb().color;
          return ((rgb[0] & 0xFF) << 16) | ((rgb[1] & 0xFF) << 8) | (rgb[2] & 0xFF);
        },

        luminosity: function () {
          // http://www.w3.org/TR/WCAG20/#relativeluminancedef
          var rgb = this.rgb().color;

          var lum = [];
          for (var i = 0; i < rgb.length; i++) {
            var chan = rgb[i] / 255;
            lum[i] = (chan <= 0.03928) ? chan / 12.92 : Math.pow(((chan + 0.055) / 1.055), 2.4);
          }

          return 0.2126 * lum[0] + 0.7152 * lum[1] + 0.0722 * lum[2];
        },

        contrast: function (color2) {
          // http://www.w3.org/TR/WCAG20/#contrast-ratiodef
          var lum1 = this.luminosity();
          var lum2 = color2.luminosity();

          if (lum1 > lum2) {
            return (lum1 + 0.05) / (lum2 + 0.05);
          }

          return (lum2 + 0.05) / (lum1 + 0.05);
        },

        level: function (color2) {
          var contrastRatio = this.contrast(color2);
          if (contrastRatio >= 7.1) {
            return 'AAA';
          }

          return (contrastRatio >= 4.5) ? 'AA' : '';
        },

        isDark: function () {
          // YIQ equation from http://24ways.org/2010/calculating-color-contrast
          var rgb = this.rgb().color;
          var yiq = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
          return yiq < 128;
        },

        isLight: function () {
          return !this.isDark();
        },

        negate: function () {
          var rgb = this.rgb();
          for (var i = 0; i < 3; i++) {
            rgb.color[i] = 255 - rgb.color[i];
          }
          return rgb;
        },

        lighten: function (ratio) {
          var hsl = this.hsl();
          hsl.color[2] += hsl.color[2] * ratio;
          return hsl;
        },

        darken: function (ratio) {
          var hsl = this.hsl();
          hsl.color[2] -= hsl.color[2] * ratio;
          return hsl;
        },

        saturate: function (ratio) {
          var hsl = this.hsl();
          hsl.color[1] += hsl.color[1] * ratio;
          return hsl;
        },

        desaturate: function (ratio) {
          var hsl = this.hsl();
          hsl.color[1] -= hsl.color[1] * ratio;
          return hsl;
        },

        whiten: function (ratio) {
          var hwb = this.hwb();
          hwb.color[1] += hwb.color[1] * ratio;
          return hwb;
        },

        blacken: function (ratio) {
          var hwb = this.hwb();
          hwb.color[2] += hwb.color[2] * ratio;
          return hwb;
        },

        grayscale: function () {
          // http://en.wikipedia.org/wiki/Grayscale#Converting_color_to_grayscale
          var rgb = this.rgb().color;
          var val = rgb[0] * 0.3 + rgb[1] * 0.59 + rgb[2] * 0.11;
          return Color.rgb(val, val, val);
        },

        fade: function (ratio) {
          return this.alpha(this.valpha - (this.valpha * ratio));
        },

        opaquer: function (ratio) {
          return this.alpha(this.valpha + (this.valpha * ratio));
        },

        rotate: function (degrees) {
          var hsl = this.hsl();
          var hue = hsl.color[0];
          hue = (hue + degrees) % 360;
          hue = hue < 0 ? 360 + hue : hue;
          hsl.color[0] = hue;
          return hsl;
        },

        mix: function (mixinColor, weight) {
          // ported from sass implementation in C
          // https://github.com/sass/libsass/blob/0e6b4a2850092356aa3ece07c6b249f0221caced/functions.cpp#L209
          var color1 = mixinColor.rgb();
          var color2 = this.rgb();
          var p = weight === undefined ? 0.5 : weight;

          var w = 2 * p - 1;
          var a = color1.alpha() - color2.alpha();

          var w1 = (((w * a === -1) ? w : (w + a) / (1 + w * a)) + 1) / 2.0;
          var w2 = 1 - w1;

          return Color.rgb(
            w1 * color1.red() + w2 * color2.red(),
            w1 * color1.green() + w2 * color2.green(),
            w1 * color1.blue() + w2 * color2.blue(),
            color1.alpha() * p + color2.alpha() * (1 - p));
        }
      };

// model conversion methods and static constructors
      Object.keys(convert).forEach(function (model) {
        if (skippedModels.indexOf(model) !== -1) {
          return;
        }

        var channels = convert[model].channels;

        // conversion methods
        Color.prototype[model] = function () {
          if (this.model === model) {
            return new Color(this);
          }

          if (arguments.length) {
            return new Color(arguments, model);
          }

          var newAlpha = typeof arguments[channels] === 'number' ? channels : this.valpha;
          return new Color(assertArray(convert[this.model][model].raw(this.color)).concat(newAlpha), model);
        };

        // 'static' construction methods
        Color[model] = function (color) {
          if (typeof color === 'number') {
            color = zeroArray(_slice.call(arguments), channels);
          }
          return new Color(color, model);
        };
      });

      function roundTo(num, places) {
        return Number(num.toFixed(places));
      }

      function roundToPlace(places) {
        return function (num) {
          return roundTo(num, places);
        };
      }

      function getset(model, channel, modifier) {
        model = Array.isArray(model) ? model : [model];

        model.forEach(function (m) {
          (limiters[m] || (limiters[m] = []))[channel] = modifier;
        });

        model = model[0];

        return function (val) {
          var result;

          if (arguments.length) {
            if (modifier) {
              val = modifier(val);
            }

            result = this[model]();
            result.color[channel] = val;
            return result;
          }

          result = this[model]().color[channel];
          if (modifier) {
            result = modifier(result);
          }

          return result;
        };
      }

      function maxfn(max) {
        return function (v) {
          return Math.max(0, Math.min(max, v));
        };
      }

      function assertArray(val) {
        return Array.isArray(val) ? val : [val];
      }

      function zeroArray(arr, length) {
        for (var i = 0; i < length; i++) {
          if (typeof arr[i] !== 'number') {
            arr[i] = 0;
          }
        }

        return arr;
      }

      module.exports = Color;

    }, { "color-convert": 2, "color-string": 5 }],
    7: [function (require, module, exports) {
      exports.parse = require('./lib/parse');
      exports.stringify = require('./lib/stringify');

    }, { "./lib/parse": 8, "./lib/stringify": 12 }],
    8: [function (require, module, exports) {
// http://www.w3.org/TR/CSS21/grammar.html
// https://github.com/visionmedia/css-parse/pull/49#issuecomment-30088027
      var commentre = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g

      module.exports = function (css, options) {
        options = options || {};

        /**
         * Positional.
         */

        var lineno = 1;
        var column = 1;

        /**
         * Update lineno and column based on `str`.
         */

        function updatePosition(str) {
          var lines = str.match(/\n/g);
          if (lines) {
            lineno += lines.length;
          }
          var i = str.lastIndexOf('\n');
          column = ~i ? str.length - i : column + str.length;
        }

        /**
         * Mark position and patch `node.position`.
         */

        function position() {
          var start = { line: lineno, column: column };
          return function (node) {
            node.position = new Position(start);
            whitespace();
            return node;
          };
        }

        /**
         * Store position information for a node
         */

        function Position(start) {
          this.start = start;
          this.end = { line: lineno, column: column };
          this.source = options.source;
        }

        /**
         * Non-enumerable source string
         */

        Position.prototype.content = css;

        /**
         * Error `msg`.
         */

        var errorsList = [];

        function error(msg) {
          var err = new Error(options.source + ':' + lineno + ':' + column + ': ' + msg);
          err.reason = msg;
          err.filename = options.source;
          err.line = lineno;
          err.column = column;
          err.source = css;

          if (options.silent) {
            errorsList.push(err);
          } else {
            throw err;
          }
        }

        /**
         * Parse stylesheet.
         */

        function stylesheet() {
          var rulesList = rules();

          return {
            type: 'stylesheet',
            stylesheet: {
              source: options.source,
              rules: rulesList,
              parsingErrors: errorsList
            }
          };
        }

        /**
         * Opening brace.
         */

        function open() {
          return match(/^{\s*/);
        }

        /**
         * Closing brace.
         */

        function close() {
          return match(/^}/);
        }

        /**
         * Parse ruleset.
         */

        function rules() {
          var node;
          var rules = [];
          whitespace();
          comments(rules);
          while (css.length && css.charAt(0) != '}' && (node = atrule() || rule())) {
            if (node !== false) {
              rules.push(node);
              comments(rules);
            }
          }
          return rules;
        }

        /**
         * Match `re` and return captures.
         */

        function match(re) {
          var m = re.exec(css);
          if (!m) {
            return;
          }
          var str = m[0];
          updatePosition(str);
          css = css.slice(str.length);
          return m;
        }

        /**
         * Parse whitespace.
         */

        function whitespace() {
          match(/^\s*/);
        }

        /**
         * Parse comments;
         */

        function comments(rules) {
          var c;
          rules = rules || [];
          while (c = comment()) {
            if (c !== false) {
              rules.push(c);
            }
          }
          return rules;
        }

        /**
         * Parse comment.
         */

        function comment() {
          var pos = position();
          if ('/' != css.charAt(0) || '*' != css.charAt(1)) {
            return;
          }

          var i = 2;
          while ("" != css.charAt(i) && ('*' != css.charAt(i) || '/' != css.charAt(i + 1))) ++i;
          i += 2;

          if ("" === css.charAt(i - 1)) {
            return error('End of comment missing');
          }

          var str = css.slice(2, i - 2);
          column += 2;
          updatePosition(str);
          css = css.slice(i);
          column += 2;

          return pos({
            type: 'comment',
            comment: str
          });
        }

        /**
         * Parse selector.
         */

        function selector() {
          var m = match(/^([^{]+)/);
          if (!m) {
            return;
          }
          /* @fix Remove all comments from selectors
     * http://ostermiller.org/findcomment.html */
          return trim(m[0])
            .replace(/\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*\/+/g, '')
            .replace(/"(?:\\"|[^"])*"|'(?:\\'|[^'])*'/g, function (m) {
              return m.replace(/,/g, '\u200C');
            })
            .split(/\s*(?![^(]*\)),\s*/)
            .map(function (s) {
              return s.replace(/\u200C/g, ',');
            });
        }

        /**
         * Parse declaration.
         */

        function declaration() {
          var pos = position();

          // prop
          var prop = match(/^(\*?[-#\/\*\\\w]+(\[[0-9a-z_-]+\])?)\s*/);
          if (!prop) {
            return;
          }
          prop = trim(prop[0]);

          // :
          if (!match(/^:\s*/)) {
            return error("property missing ':'");
          }

          // val
          var val = match(/^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^\)]*?\)|[^};])+)/);

          var ret = pos({
            type: 'declaration',
            property: prop.replace(commentre, ''),
            value: val ? trim(val[0]).replace(commentre, '') : ''
          });

          // ;
          match(/^[;\s]*/);

          return ret;
        }

        /**
         * Parse declarations.
         */

        function declarations() {
          var decls = [];

          if (!open()) {
            return error("missing '{'");
          }
          comments(decls);

          // declarations
          var decl;
          while (decl = declaration()) {
            if (decl !== false) {
              decls.push(decl);
              comments(decls);
            }
          }

          if (!close()) {
            return error("missing '}'");
          }
          return decls;
        }

        /**
         * Parse keyframe.
         */

        function keyframe() {
          var m;
          var vals = [];
          var pos = position();

          while (m = match(/^((\d+\.\d+|\.\d+|\d+)%?|[a-z]+)\s*/)) {
            vals.push(m[1]);
            match(/^,\s*/);
          }

          if (!vals.length) {
            return;
          }

          return pos({
            type: 'keyframe',
            values: vals,
            declarations: declarations()
          });
        }

        /**
         * Parse keyframes.
         */

        function atkeyframes() {
          var pos = position();
          var m = match(/^@([-\w]+)?keyframes\s*/);

          if (!m) {
            return;
          }
          var vendor = m[1];

          // identifier
          var m = match(/^([-\w]+)\s*/);
          if (!m) {
            return error("@keyframes missing name");
          }
          var name = m[1];

          if (!open()) {
            return error("@keyframes missing '{'");
          }

          var frame;
          var frames = comments();
          while (frame = keyframe()) {
            frames.push(frame);
            frames = frames.concat(comments());
          }

          if (!close()) {
            return error("@keyframes missing '}'");
          }

          return pos({
            type: 'keyframes',
            name: name,
            vendor: vendor,
            keyframes: frames
          });
        }

        /**
         * Parse supports.
         */

        function atsupports() {
          var pos = position();
          var m = match(/^@supports *([^{]+)/);

          if (!m) {
            return;
          }
          var supports = trim(m[1]);

          if (!open()) {
            return error("@supports missing '{'");
          }

          var style = comments().concat(rules());

          if (!close()) {
            return error("@supports missing '}'");
          }

          return pos({
            type: 'supports',
            supports: supports,
            rules: style
          });
        }

        /**
         * Parse host.
         */

        function athost() {
          var pos = position();
          var m = match(/^@host\s*/);

          if (!m) {
            return;
          }

          if (!open()) {
            return error("@host missing '{'");
          }

          var style = comments().concat(rules());

          if (!close()) {
            return error("@host missing '}'");
          }

          return pos({
            type: 'host',
            rules: style
          });
        }

        /**
         * Parse media.
         */

        function atmedia() {
          var pos = position();
          var m = match(/^@media *([^{]+)/);

          if (!m) {
            return;
          }
          var media = trim(m[1]);

          if (!open()) {
            return error("@media missing '{'");
          }

          var style = comments().concat(rules());

          if (!close()) {
            return error("@media missing '}'");
          }

          return pos({
            type: 'media',
            media: media,
            rules: style
          });
        }


        /**
         * Parse custom-media.
         */

        function atcustommedia() {
          var pos = position();
          var m = match(/^@custom-media\s+(--[^\s]+)\s*([^{;]+);/);
          if (!m) {
            return;
          }

          return pos({
            type: 'custom-media',
            name: trim(m[1]),
            media: trim(m[2])
          });
        }

        /**
         * Parse paged media.
         */

        function atpage() {
          var pos = position();
          var m = match(/^@page */);
          if (!m) {
            return;
          }

          var sel = selector() || [];

          if (!open()) {
            return error("@page missing '{'");
          }
          var decls = comments();

          // declarations
          var decl;
          while (decl = declaration()) {
            decls.push(decl);
            decls = decls.concat(comments());
          }

          if (!close()) {
            return error("@page missing '}'");
          }

          return pos({
            type: 'page',
            selectors: sel,
            declarations: decls
          });
        }

        /**
         * Parse document.
         */

        function atdocument() {
          var pos = position();
          var m = match(/^@([-\w]+)?document *([^{]+)/);
          if (!m) {
            return;
          }

          var vendor = trim(m[1]);
          var doc = trim(m[2]);

          if (!open()) {
            return error("@document missing '{'");
          }

          var style = comments().concat(rules());

          if (!close()) {
            return error("@document missing '}'");
          }

          return pos({
            type: 'document',
            document: doc,
            vendor: vendor,
            rules: style
          });
        }

        /**
         * Parse font-face.
         */

        function atfontface() {
          var pos = position();
          var m = match(/^@font-face\s*/);
          if (!m) {
            return;
          }

          if (!open()) {
            return error("@font-face missing '{'");
          }
          var decls = comments();

          // declarations
          var decl;
          while (decl = declaration()) {
            decls.push(decl);
            decls = decls.concat(comments());
          }

          if (!close()) {
            return error("@font-face missing '}'");
          }

          return pos({
            type: 'font-face',
            declarations: decls
          });
        }

        /**
         * Parse import
         */

        var atimport = _compileAtrule('import');

        /**
         * Parse charset
         */

        var atcharset = _compileAtrule('charset');

        /**
         * Parse namespace
         */

        var atnamespace = _compileAtrule('namespace');

        /**
         * Parse non-block at-rules
         */


        function _compileAtrule(name) {
          var re = new RegExp('^@' + name + '\\s*([^;]+);');
          return function () {
            var pos = position();
            var m = match(re);
            if (!m) {
              return;
            }
            var ret = { type: name };
            ret[name] = m[1].trim();
            return pos(ret);
          }
        }

        /**
         * Parse at rule.
         */

        function atrule() {
          if (css[0] != '@') {
            return;
          }

          return atkeyframes()
            || atmedia()
            || atcustommedia()
            || atsupports()
            || atimport()
            || atcharset()
            || atnamespace()
            || atdocument()
            || atpage()
            || athost()
            || atfontface();
        }

        /**
         * Parse rule.
         */

        function rule() {
          var pos = position();
          var sel = selector();

          if (!sel) {
            return error('selector missing');
          }
          comments();

          return pos({
            type: 'rule',
            selectors: sel,
            declarations: declarations()
          });
        }

        return addParent(stylesheet());
      };

      /**
       * Trim `str`.
       */

      function trim(str) {
        return str ? str.replace(/^\s+|\s+$/g, '') : '';
      }

      /**
       * Adds non-enumerable parent node reference to each node.
       */

      function addParent(obj, parent) {
        var isNode = obj && typeof obj.type === 'string';
        var childParent = isNode ? obj : parent;

        for (var k in obj) {
          var value = obj[k];
          if (Array.isArray(value)) {
            value.forEach(function (v) {
              addParent(v, childParent);
            });
          } else if (value && typeof value === 'object') {
            addParent(value, childParent);
          }
        }

        if (isNode) {
          Object.defineProperty(obj, 'parent', {
            configurable: true,
            writable: true,
            enumerable: false,
            value: parent || null
          });
        }

        return obj;
      }

    }, {}],
    9: [function (require, module, exports) {

      /**
       * Expose `Compiler`.
       */

      module.exports = Compiler;

      /**
       * Initialize a compiler.
       *
       * @param {Type} name
       * @return {Type}
       * @api public
       */

      function Compiler(opts) {
        this.options = opts || {};
      }

      /**
       * Emit `str`
       */

      Compiler.prototype.emit = function (str) {
        return str;
      };

      /**
       * Visit `node`.
       */

      Compiler.prototype.visit = function (node) {
        return this[node.type](node);
      };

      /**
       * Map visit over array of `nodes`, optionally using a `delim`
       */

      Compiler.prototype.mapVisit = function (nodes, delim) {
        var buf = '';
        delim = delim || '';

        for (var i = 0, length = nodes.length; i < length; i++) {
          buf += this.visit(nodes[i]);
          if (delim && i < length - 1) {
            buf += this.emit(delim);
          }
        }

        return buf;
      };

    }, {}],
    10: [function (require, module, exports) {

      /**
       * Module dependencies.
       */

      var Base = require('./compiler');
      var inherits = require('inherits');

      /**
       * Expose compiler.
       */

      module.exports = Compiler;

      /**
       * Initialize a new `Compiler`.
       */

      function Compiler(options) {
        Base.call(this, options);
      }

      /**
       * Inherit from `Base.prototype`.
       */

      inherits(Compiler, Base);

      /**
       * Compile `node`.
       */

      Compiler.prototype.compile = function (node) {
        return node.stylesheet
          .rules.map(this.visit, this)
          .join('');
      };

      /**
       * Visit comment node.
       */

      Compiler.prototype.comment = function (node) {
        return this.emit('', node.position);
      };

      /**
       * Visit import node.
       */

      Compiler.prototype.import = function (node) {
        return this.emit('@import ' + node.import + ';', node.position);
      };

      /**
       * Visit media node.
       */

      Compiler.prototype.media = function (node) {
        return this.emit('@media ' + node.media, node.position)
          + this.emit('{')
          + this.mapVisit(node.rules)
          + this.emit('}');
      };

      /**
       * Visit document node.
       */

      Compiler.prototype.document = function (node) {
        var doc = '@' + (node.vendor || '') + 'document ' + node.document;

        return this.emit(doc, node.position)
          + this.emit('{')
          + this.mapVisit(node.rules)
          + this.emit('}');
      };

      /**
       * Visit charset node.
       */

      Compiler.prototype.charset = function (node) {
        return this.emit('@charset ' + node.charset + ';', node.position);
      };

      /**
       * Visit namespace node.
       */

      Compiler.prototype.namespace = function (node) {
        return this.emit('@namespace ' + node.namespace + ';', node.position);
      };

      /**
       * Visit supports node.
       */

      Compiler.prototype.supports = function (node) {
        return this.emit('@supports ' + node.supports, node.position)
          + this.emit('{')
          + this.mapVisit(node.rules)
          + this.emit('}');
      };

      /**
       * Visit keyframes node.
       */

      Compiler.prototype.keyframes = function (node) {
        return this.emit('@'
          + (node.vendor || '')
          + 'keyframes '
          + node.name, node.position)
          + this.emit('{')
          + this.mapVisit(node.keyframes)
          + this.emit('}');
      };

      /**
       * Visit keyframe node.
       */

      Compiler.prototype.keyframe = function (node) {
        var decls = node.declarations;

        return this.emit(node.values.join(','), node.position)
          + this.emit('{')
          + this.mapVisit(decls)
          + this.emit('}');
      };

      /**
       * Visit page node.
       */

      Compiler.prototype.page = function (node) {
        var sel = node.selectors.length
          ? node.selectors.join(', ')
          : '';

        return this.emit('@page ' + sel, node.position)
          + this.emit('{')
          + this.mapVisit(node.declarations)
          + this.emit('}');
      };

      /**
       * Visit font-face node.
       */

      Compiler.prototype['font-face'] = function (node) {
        return this.emit('@font-face', node.position)
          + this.emit('{')
          + this.mapVisit(node.declarations)
          + this.emit('}');
      };

      /**
       * Visit host node.
       */

      Compiler.prototype.host = function (node) {
        return this.emit('@host', node.position)
          + this.emit('{')
          + this.mapVisit(node.rules)
          + this.emit('}');
      };

      /**
       * Visit custom-media node.
       */

      Compiler.prototype['custom-media'] = function (node) {
        return this.emit('@custom-media ' + node.name + ' ' + node.media + ';', node.position);
      };

      /**
       * Visit rule node.
       */

      Compiler.prototype.rule = function (node) {
        var decls = node.declarations;
        if (!decls.length) {
          return '';
        }

        return this.emit(node.selectors.join(','), node.position)
          + this.emit('{')
          + this.mapVisit(decls)
          + this.emit('}');
      };

      /**
       * Visit declaration node.
       */

      Compiler.prototype.declaration = function (node) {
        return this.emit(node.property + ':' + node.value, node.position) + this.emit(';');
      };


    }, { "./compiler": 9, "inherits": 42 }],
    11: [function (require, module, exports) {

      /**
       * Module dependencies.
       */

      var Base = require('./compiler');
      var inherits = require('inherits');

      /**
       * Expose compiler.
       */

      module.exports = Compiler;

      /**
       * Initialize a new `Compiler`.
       */

      function Compiler(options) {
        options = options || {};
        Base.call(this, options);
        this.indentation = options.indent;
      }

      /**
       * Inherit from `Base.prototype`.
       */

      inherits(Compiler, Base);

      /**
       * Compile `node`.
       */

      Compiler.prototype.compile = function (node) {
        return this.stylesheet(node);
      };

      /**
       * Visit stylesheet node.
       */

      Compiler.prototype.stylesheet = function (node) {
        return this.mapVisit(node.stylesheet.rules, '\n\n');
      };

      /**
       * Visit comment node.
       */

      Compiler.prototype.comment = function (node) {
        return this.emit(this.indent() + '/*' + node.comment + '*/', node.position);
      };

      /**
       * Visit import node.
       */

      Compiler.prototype.import = function (node) {
        return this.emit('@import ' + node.import + ';', node.position);
      };

      /**
       * Visit media node.
       */

      Compiler.prototype.media = function (node) {
        return this.emit('@media ' + node.media, node.position)
          + this.emit(
            ' {\n'
            + this.indent(1))
          + this.mapVisit(node.rules, '\n\n')
          + this.emit(
            this.indent(-1)
            + '\n}');
      };

      /**
       * Visit document node.
       */

      Compiler.prototype.document = function (node) {
        var doc = '@' + (node.vendor || '') + 'document ' + node.document;

        return this.emit(doc, node.position)
          + this.emit(
            ' '
            + ' {\n'
            + this.indent(1))
          + this.mapVisit(node.rules, '\n\n')
          + this.emit(
            this.indent(-1)
            + '\n}');
      };

      /**
       * Visit charset node.
       */

      Compiler.prototype.charset = function (node) {
        return this.emit('@charset ' + node.charset + ';', node.position);
      };

      /**
       * Visit namespace node.
       */

      Compiler.prototype.namespace = function (node) {
        return this.emit('@namespace ' + node.namespace + ';', node.position);
      };

      /**
       * Visit supports node.
       */

      Compiler.prototype.supports = function (node) {
        return this.emit('@supports ' + node.supports, node.position)
          + this.emit(
            ' {\n'
            + this.indent(1))
          + this.mapVisit(node.rules, '\n\n')
          + this.emit(
            this.indent(-1)
            + '\n}');
      };

      /**
       * Visit keyframes node.
       */

      Compiler.prototype.keyframes = function (node) {
        return this.emit('@' + (node.vendor || '') + 'keyframes ' + node.name, node.position)
          + this.emit(
            ' {\n'
            + this.indent(1))
          + this.mapVisit(node.keyframes, '\n')
          + this.emit(
            this.indent(-1)
            + '}');
      };

      /**
       * Visit keyframe node.
       */

      Compiler.prototype.keyframe = function (node) {
        var decls = node.declarations;

        return this.emit(this.indent())
          + this.emit(node.values.join(', '), node.position)
          + this.emit(
            ' {\n'
            + this.indent(1))
          + this.mapVisit(decls, '\n')
          + this.emit(
            this.indent(-1)
            + '\n'
            + this.indent() + '}\n');
      };

      /**
       * Visit page node.
       */

      Compiler.prototype.page = function (node) {
        var sel = node.selectors.length
          ? node.selectors.join(', ') + ' '
          : '';

        return this.emit('@page ' + sel, node.position)
          + this.emit('{\n')
          + this.emit(this.indent(1))
          + this.mapVisit(node.declarations, '\n')
          + this.emit(this.indent(-1))
          + this.emit('\n}');
      };

      /**
       * Visit font-face node.
       */

      Compiler.prototype['font-face'] = function (node) {
        return this.emit('@font-face ', node.position)
          + this.emit('{\n')
          + this.emit(this.indent(1))
          + this.mapVisit(node.declarations, '\n')
          + this.emit(this.indent(-1))
          + this.emit('\n}');
      };

      /**
       * Visit host node.
       */

      Compiler.prototype.host = function (node) {
        return this.emit('@host', node.position)
          + this.emit(
            ' {\n'
            + this.indent(1))
          + this.mapVisit(node.rules, '\n\n')
          + this.emit(
            this.indent(-1)
            + '\n}');
      };

      /**
       * Visit custom-media node.
       */

      Compiler.prototype['custom-media'] = function (node) {
        return this.emit('@custom-media ' + node.name + ' ' + node.media + ';', node.position);
      };

      /**
       * Visit rule node.
       */

      Compiler.prototype.rule = function (node) {
        var indent = this.indent();
        var decls = node.declarations;
        if (!decls.length) {
          return '';
        }

        return this.emit(node.selectors.map(function (s) {
            return indent + s
          }).join(',\n'), node.position)
          + this.emit(' {\n')
          + this.emit(this.indent(1))
          + this.mapVisit(decls, '\n')
          + this.emit(this.indent(-1))
          + this.emit('\n' + this.indent() + '}');
      };

      /**
       * Visit declaration node.
       */

      Compiler.prototype.declaration = function (node) {
        return this.emit(this.indent())
          + this.emit(node.property + ': ' + node.value, node.position)
          + this.emit(';');
      };

      /**
       * Increase, decrease or return current indentation.
       */

      Compiler.prototype.indent = function (level) {
        this.level = this.level || 1;

        if (null != level) {
          this.level += level;
          return '';
        }

        return Array(this.level).join(this.indentation || '  ');
      };

    }, { "./compiler": 9, "inherits": 42 }],
    12: [function (require, module, exports) {

      /**
       * Module dependencies.
       */

      var Compressed = require('./compress');
      var Identity = require('./identity');

      /**
       * Stringfy the given AST `node`.
       *
       * Options:
       *
       *  - `compress` space-optimized output
       *  - `sourcemap` return an object with `.code` and `.map`
       *
       * @param {Object} node
       * @param {Object} [options]
       * @return {String}
       * @api public
       */

      module.exports = function (node, options) {
        options = options || {};

        var compiler = options.compress
          ? new Compressed(options)
          : new Identity(options);

        // source maps
        if (options.sourcemap) {
          var sourcemaps = require('./source-map-support');
          sourcemaps(compiler);

          var code = compiler.compile(node);
          compiler.applySourceMaps();

          var map = options.sourcemap === 'generator'
            ? compiler.map
            : compiler.map.toJSON();

          return { code: code, map: map };
        }

        var code = compiler.compile(node);
        return code;
      };

    }, { "./compress": 10, "./identity": 11, "./source-map-support": 13 }],
    13: [function (require, module, exports) {

      /**
       * Module dependencies.
       */

      var SourceMap = require('source-map').SourceMapGenerator;
      var SourceMapConsumer = require('source-map').SourceMapConsumer;
      var sourceMapResolve = require('source-map-resolve');
      var urix = require('urix');
      var fs = require('fs');
      var path = require('path');

      /**
       * Expose `mixin()`.
       */

      module.exports = mixin;

      /**
       * Mixin source map support into `compiler`.
       *
       * @param {Compiler} compiler
       * @api public
       */

      function mixin(compiler) {
        compiler._comment = compiler.comment;
        compiler.map = new SourceMap();
        compiler.position = { line: 1, column: 1 };
        compiler.files = {};
        for (var k in exports) compiler[k] = exports[k];
      }

      /**
       * Update position.
       *
       * @param {String} str
       * @api private
       */

      exports.updatePosition = function (str) {
        var lines = str.match(/\n/g);
        if (lines) {
          this.position.line += lines.length;
        }
        var i = str.lastIndexOf('\n');
        this.position.column = ~i ? str.length - i : this.position.column + str.length;
      };

      /**
       * Emit `str`.
       *
       * @param {String} str
       * @param {Object} [pos]
       * @return {String}
       * @api private
       */

      exports.emit = function (str, pos) {
        if (pos) {
          var sourceFile = urix(pos.source || 'source.css');

          this.map.addMapping({
            source: sourceFile,
            generated: {
              line: this.position.line,
              column: Math.max(this.position.column - 1, 0)
            },
            original: {
              line: pos.start.line,
              column: pos.start.column - 1
            }
          });

          this.addFile(sourceFile, pos);
        }

        this.updatePosition(str);

        return str;
      };

      /**
       * Adds a file to the source map output if it has not already been added
       * @param {String} file
       * @param {Object} pos
       */

      exports.addFile = function (file, pos) {
        if (typeof pos.content !== 'string') {
          return;
        }
        if (Object.prototype.hasOwnProperty.call(this.files, file)) {
          return;
        }

        this.files[file] = pos.content;
      };

      /**
       * Applies any original source maps to the output and embeds the source file
       * contents in the source map.
       */

      exports.applySourceMaps = function () {
        Object.keys(this.files).forEach(function (file) {
          var content = this.files[file];
          this.map.setSourceContent(file, content);

          if (this.options.inputSourcemaps !== false) {
            var originalMap = sourceMapResolve.resolveSync(
              content, file, fs.readFileSync);
            if (originalMap) {
              var map = new SourceMapConsumer(originalMap.map);
              var relativeTo = originalMap.sourcesRelativeTo;
              this.map.applySourceMap(map, file, urix(path.dirname(relativeTo)));
            }
          }
        }, this);
      };

      /**
       * Process comments, drops sourceMap comments.
       * @param {Object} node
       */

      exports.comment = function (node) {
        if (/^# sourceMappingURL=/.test(node.comment)) {
          return this.emit('', node.position);
        } else {
          return this._comment(node);
        }
      };

    }, { "fs": undefined, "path": undefined, "source-map": 58, "source-map-resolve": 46, "urix": 59 }],
    14: [function (require, module, exports) {
      /*
  Module dependencies
*/
      var ElementType = require('domelementtype');
      var entities = require('entities');

      var unencodedElements = {
        __proto__: null,
        style: true,
        script: true,
        xmp: true,
        iframe: true,
        noembed: true,
        noframes: true,
        plaintext: true,
        noscript: true
      };

      /*
  Format attributes
*/
      function formatAttrs(attributes, opts) {
        if (!attributes) {
          return;
        }

        var output = '',
          value;

        // Loop through the attributes
        for (var key in attributes) {
          value = attributes[key];
          if (output) {
            output += ' ';
          }

          output += key;
          if ((value !== null && value !== '') || opts.xmlMode) {
            output += '="' + (opts.decodeEntities ? entities.encodeXML(value) : value) + '"';
          }
        }

        return output;
      }

      /*
  Self-enclosing tags (stolen from node-htmlparser)
*/
      var singleTag = {
        __proto__: null,
        area: true,
        base: true,
        basefont: true,
        br: true,
        col: true,
        command: true,
        embed: true,
        frame: true,
        hr: true,
        img: true,
        input: true,
        isindex: true,
        keygen: true,
        link: true,
        meta: true,
        param: true,
        source: true,
        track: true,
        wbr: true,
      };


      var render = module.exports = function (dom, opts) {
        if (!Array.isArray(dom) && !dom.cheerio) {
          dom = [dom];
        }
        opts = opts || {};

        var output = '';

        for (var i = 0; i < dom.length; i++) {
          var elem = dom[i];

          if (elem.type === 'root') {
            output += render(elem.children, opts);
          } else if (ElementType.isTag(elem)) {
            output += renderTag(elem, opts);
          } else if (elem.type === ElementType.Directive) {
            output += renderDirective(elem);
          } else if (elem.type === ElementType.Comment) {
            output += renderComment(elem);
          } else if (elem.type === ElementType.CDATA) {
            output += renderCdata(elem);
          } else {
            output += renderText(elem, opts);
          }
        }

        return output;
      };

      function renderTag(elem, opts) {
        // Handle SVG
        if (elem.name === "svg") {
          opts = { decodeEntities: opts.decodeEntities, xmlMode: true };
        }

        var tag = '<' + elem.name,
          attribs = formatAttrs(elem.attribs, opts);

        if (attribs) {
          tag += ' ' + attribs;
        }

        if (
          opts.xmlMode
          && (!elem.children || elem.children.length === 0)
        )
        {
          tag += '/>';
        } else {
          tag += '>';
          if (elem.children) {
            tag += render(elem.children, opts);
          }

          if (!singleTag[elem.name] || opts.xmlMode) {
            tag += '</' + elem.name + '>';
          }
        }

        return tag;
      }

      function renderDirective(elem) {
        return '<' + elem.data + '>';
      }

      function renderText(elem, opts) {
        var data = elem.data || '';

        // if entities weren't decoded, no need to encode them back
        if (opts.decodeEntities && !(elem.parent && elem.parent.name in unencodedElements)) {
          data = entities.encodeXML(data);
        }

        return data;
      }

      function renderCdata(elem) {
        return '<![CDATA[' + elem.children[0].data + ']]>';
      }

      function renderComment(elem) {
        return '<!--' + elem.data + '-->';
      }

    }, { "domelementtype": 15, "entities": 26 }],
    15: [function (require, module, exports) {
//Types of elements found in the DOM
      module.exports = {
        Text: "text", //Text
        Directive: "directive", //<? ... ?>
        Comment: "comment", //<!-- ... -->
        Script: "script", //<script> tags
        Style: "style", //<style> tags
        Tag: "tag", //Any tag
        CDATA: "cdata", //<![CDATA[ ... ]]>
        Doctype: "doctype",

        isTag: function (elem) {
          return elem.type === "tag" || elem.type === "script" || elem.type === "style";
        }
      };

    }, {}],
    16: [function (require, module, exports) {
      var ElementType = require("domelementtype");

      var re_whitespace = /\s+/g;
      var NodePrototype = require("./lib/node");
      var ElementPrototype = require("./lib/element");

      function DomHandler(callback, options, elementCB) {
        if (typeof callback === "object") {
          elementCB = options;
          options = callback;
          callback = null;
        } else if (typeof options === "function") {
          elementCB = options;
          options = defaultOpts;
        }
        this._callback = callback;
        this._options = options || defaultOpts;
        this._elementCB = elementCB;
        this.dom = [];
        this._done = false;
        this._tagStack = [];
        this._parser = this._parser || null;
      }

//default options
      var defaultOpts = {
        normalizeWhitespace: false, //Replace all whitespace with single spaces
        withStartIndices: false, //Add startIndex properties to nodes
        withEndIndices: false, //Add endIndex properties to nodes
      };

      DomHandler.prototype.onparserinit = function (parser) {
        this._parser = parser;
      };

//Resets the handler back to starting state
      DomHandler.prototype.onreset = function () {
        DomHandler.call(this, this._callback, this._options, this._elementCB);
      };

//Signals the handler that parsing is done
      DomHandler.prototype.onend = function () {
        if (this._done) {
          return;
        }
        this._done = true;
        this._parser = null;
        this._handleCallback(null);
      };

      DomHandler.prototype._handleCallback =
        DomHandler.prototype.onerror = function (error) {
          if (typeof this._callback === "function") {
            this._callback(error, this.dom);
          } else {
            if (error) {
              throw error;
            }
          }
        };

      DomHandler.prototype.onclosetag = function () {
        //if(this._tagStack.pop().name !== name) this._handleCallback(Error("Tagname didn't match!"));

        var elem = this._tagStack.pop();

        if (this._options.withEndIndices && elem) {
          elem.endIndex = this._parser.endIndex;
        }

        if (this._elementCB) {
          this._elementCB(elem);
        }
      };

      DomHandler.prototype._createDomElement = function (properties) {
        if (!this._options.withDomLvl1) {
          return properties;
        }

        var element;
        if (properties.type === "tag") {
          element = Object.create(ElementPrototype);
        } else {
          element = Object.create(NodePrototype);
        }

        for (var key in properties) {
          if (properties.hasOwnProperty(key)) {
            element[key] = properties[key];
          }
        }

        return element;
      };

      DomHandler.prototype._addDomElement = function (element) {
        var parent = this._tagStack[this._tagStack.length - 1];
        var siblings = parent ? parent.children : this.dom;
        var previousSibling = siblings[siblings.length - 1];

        element.next = null;

        if (this._options.withStartIndices) {
          element.startIndex = this._parser.startIndex;
        }
        if (this._options.withEndIndices) {
          element.endIndex = this._parser.endIndex;
        }

        if (previousSibling) {
          element.prev = previousSibling;
          previousSibling.next = element;
        } else {
          element.prev = null;
        }

        siblings.push(element);
        element.parent = parent || null;
      };

      DomHandler.prototype.onopentag = function (name, attribs) {
        var properties = {
          type: name === "script" ? ElementType.Script : name === "style" ? ElementType.Style : ElementType.Tag,
          name: name,
          attribs: attribs,
          children: []
        };

        var element = this._createDomElement(properties);

        this._addDomElement(element);

        this._tagStack.push(element);
      };

      DomHandler.prototype.ontext = function (data) {
        //the ignoreWhitespace is officially dropped, but for now,
        //it's an alias for normalizeWhitespace
        var normalize = this._options.normalizeWhitespace || this._options.ignoreWhitespace;

        var lastTag;

        if (!this._tagStack.length && this.dom.length && (lastTag = this.dom[this.dom.length - 1]).type === ElementType.Text) {
          if (normalize) {
            lastTag.data = (lastTag.data + data).replace(re_whitespace, " ");
          } else {
            lastTag.data += data;
          }
        } else {
          if (
            this._tagStack.length &&
            (lastTag = this._tagStack[this._tagStack.length - 1]) &&
            (lastTag = lastTag.children[lastTag.children.length - 1]) &&
            lastTag.type === ElementType.Text
          )
          {
            if (normalize) {
              lastTag.data = (lastTag.data + data).replace(re_whitespace, " ");
            } else {
              lastTag.data += data;
            }
          } else {
            if (normalize) {
              data = data.replace(re_whitespace, " ");
            }

            var element = this._createDomElement({
              data: data,
              type: ElementType.Text
            });

            this._addDomElement(element);
          }
        }
      };

      DomHandler.prototype.oncomment = function (data) {
        var lastTag = this._tagStack[this._tagStack.length - 1];

        if (lastTag && lastTag.type === ElementType.Comment) {
          lastTag.data += data;
          return;
        }

        var properties = {
          data: data,
          type: ElementType.Comment
        };

        var element = this._createDomElement(properties);

        this._addDomElement(element);
        this._tagStack.push(element);
      };

      DomHandler.prototype.oncdatastart = function () {
        var properties = {
          children: [{
            data: "",
            type: ElementType.Text
          }],
          type: ElementType.CDATA
        };

        var element = this._createDomElement(properties);

        this._addDomElement(element);
        this._tagStack.push(element);
      };

      DomHandler.prototype.oncommentend = DomHandler.prototype.oncdataend = function () {
        this._tagStack.pop();
      };

      DomHandler.prototype.onprocessinginstruction = function (name, data) {
        var element = this._createDomElement({
          name: name,
          data: data,
          type: ElementType.Directive
        });

        this._addDomElement(element);
      };

      module.exports = DomHandler;

    }, { "./lib/element": 17, "./lib/node": 18, "domelementtype": 15 }],
    17: [function (require, module, exports) {
// DOM-Level-1-compliant structure
      var NodePrototype = require('./node');
      var ElementPrototype = module.exports = Object.create(NodePrototype);

      var domLvl1 = {
        tagName: "name"
      };

      Object.keys(domLvl1).forEach(function (key) {
        var shorthand = domLvl1[key];
        Object.defineProperty(ElementPrototype, key, {
          get: function () {
            return this[shorthand] || null;
          },
          set: function (val) {
            this[shorthand] = val;
            return val;
          }
        });
      });

    }, { "./node": 18 }],
    18: [function (require, module, exports) {
// This object will be used as the prototype for Nodes when creating a
// DOM-Level-1-compliant structure.
      var NodePrototype = module.exports = {
        get firstChild() {
          var children = this.children;
          return children && children[0] || null;
        },
        get lastChild() {
          var children = this.children;
          return children && children[children.length - 1] || null;
        },
        get nodeType() {
          return nodeTypes[this.type] || nodeTypes.element;
        }
      };

      var domLvl1 = {
        tagName: "name",
        childNodes: "children",
        parentNode: "parent",
        previousSibling: "prev",
        nextSibling: "next",
        nodeValue: "data"
      };

      var nodeTypes = {
        element: 1,
        text: 3,
        cdata: 4,
        comment: 8
      };

      Object.keys(domLvl1).forEach(function (key) {
        var shorthand = domLvl1[key];
        Object.defineProperty(NodePrototype, key, {
          get: function () {
            return this[shorthand] || null;
          },
          set: function (val) {
            this[shorthand] = val;
            return val;
          }
        });
      });

    }, {}],
    19: [function (require, module, exports) {
      var DomUtils = module.exports;

      [
        require("./lib/stringify"),
        require("./lib/traversal"),
        require("./lib/manipulation"),
        require("./lib/querying"),
        require("./lib/legacy"),
        require("./lib/helpers")
      ].forEach(function (ext) {
        Object.keys(ext).forEach(function (key) {
          DomUtils[key] = ext[key].bind(DomUtils);
        });
      });

    }, {
      "./lib/helpers": 20,
      "./lib/legacy": 21,
      "./lib/manipulation": 22,
      "./lib/querying": 23,
      "./lib/stringify": 24,
      "./lib/traversal": 25
    }],
    20: [function (require, module, exports) {
// removeSubsets
// Given an array of nodes, remove any member that is contained by another.
      exports.removeSubsets = function (nodes) {
        var idx = nodes.length, node, ancestor, replace;

        // Check if each node (or one of its ancestors) is already contained in the
        // array.
        while (--idx > -1) {
          node = ancestor = nodes[idx];

          // Temporarily remove the node under consideration
          nodes[idx] = null;
          replace = true;

          while (ancestor) {
            if (nodes.indexOf(ancestor) > -1) {
              replace = false;
              nodes.splice(idx, 1);
              break;
            }
            ancestor = ancestor.parent;
          }

          // If the node has been found to be unique, re-insert it.
          if (replace) {
            nodes[idx] = node;
          }
        }

        return nodes;
      };

// Source: http://dom.spec.whatwg.org/#dom-node-comparedocumentposition
      var POSITION = {
        DISCONNECTED: 1,
        PRECEDING: 2,
        FOLLOWING: 4,
        CONTAINS: 8,
        CONTAINED_BY: 16
      };

// Compare the position of one node against another node in any other document.
// The return value is a bitmask with the following values:
//
// document order:
// > There is an ordering, document order, defined on all the nodes in the
// > document corresponding to the order in which the first character of the
// > XML representation of each node occurs in the XML representation of the
// > document after expansion of general entities. Thus, the document element
// > node will be the first node. Element nodes occur before their children.
// > Thus, document order orders element nodes in order of the occurrence of
// > their start-tag in the XML (after expansion of entities). The attribute
// > nodes of an element occur after the element and before its children. The
// > relative order of attribute nodes is implementation-dependent./
// Source:
// http://www.w3.org/TR/DOM-Level-3-Core/glossary.html#dt-document-order
//
// @argument {Node} nodaA The first node to use in the comparison
// @argument {Node} nodeB The second node to use in the comparison
//
// @return {Number} A bitmask describing the input nodes' relative position.
//         See http://dom.spec.whatwg.org/#dom-node-comparedocumentposition for
//         a description of these values.
      var comparePos = exports.compareDocumentPosition = function (nodeA, nodeB) {
        var aParents = [];
        var bParents = [];
        var current, sharedParent, siblings, aSibling, bSibling, idx;

        if (nodeA === nodeB) {
          return 0;
        }

        current = nodeA;
        while (current) {
          aParents.unshift(current);
          current = current.parent;
        }
        current = nodeB;
        while (current) {
          bParents.unshift(current);
          current = current.parent;
        }

        idx = 0;
        while (aParents[idx] === bParents[idx]) {
          idx++;
        }

        if (idx === 0) {
          return POSITION.DISCONNECTED;
        }

        sharedParent = aParents[idx - 1];
        siblings = sharedParent.children;
        aSibling = aParents[idx];
        bSibling = bParents[idx];

        if (siblings.indexOf(aSibling) > siblings.indexOf(bSibling)) {
          if (sharedParent === nodeB) {
            return POSITION.FOLLOWING | POSITION.CONTAINED_BY;
          }
          return POSITION.FOLLOWING;
        } else {
          if (sharedParent === nodeA) {
            return POSITION.PRECEDING | POSITION.CONTAINS;
          }
          return POSITION.PRECEDING;
        }
      };

// Sort an array of nodes based on their relative position in the document and
// remove any duplicate nodes. If the array contains nodes that do not belong
// to the same document, sort order is unspecified.
//
// @argument {Array} nodes Array of DOM nodes
//
// @returns {Array} collection of unique nodes, sorted in document order
      exports.uniqueSort = function (nodes) {
        var idx = nodes.length, node, position;

        nodes = nodes.slice();

        while (--idx > -1) {
          node = nodes[idx];
          position = nodes.indexOf(node);
          if (position > -1 && position < idx) {
            nodes.splice(idx, 1);
          }
        }
        nodes.sort(function (a, b) {
          var relative = comparePos(a, b);
          if (relative & POSITION.PRECEDING) {
            return -1;
          } else if (relative & POSITION.FOLLOWING) {
            return 1;
          }
          return 0;
        });

        return nodes;
      };

    }, {}],
    21: [function (require, module, exports) {
      var ElementType = require("domelementtype");
      var isTag = exports.isTag = ElementType.isTag;

      exports.testElement = function (options, element) {
        for (var key in options) {
          if (!options.hasOwnProperty(key)) {
            ;
          } else if (key === "tag_name") {
            if (!isTag(element) || !options.tag_name(element.name)) {
              return false;
            }
          } else if (key === "tag_type") {
            if (!options.tag_type(element.type)) {
              return false;
            }
          } else if (key === "tag_contains") {
            if (isTag(element) || !options.tag_contains(element.data)) {
              return false;
            }
          } else if (!element.attribs || !options[key](element.attribs[key])) {
            return false;
          }
        }
        return true;
      };

      var Checks = {
        tag_name: function (name) {
          if (typeof name === "function") {
            return function (elem) {
              return isTag(elem) && name(elem.name);
            };
          } else if (name === "*") {
            return isTag;
          } else {
            return function (elem) {
              return isTag(elem) && elem.name === name;
            };
          }
        },
        tag_type: function (type) {
          if (typeof type === "function") {
            return function (elem) {
              return type(elem.type);
            };
          } else {
            return function (elem) {
              return elem.type === type;
            };
          }
        },
        tag_contains: function (data) {
          if (typeof data === "function") {
            return function (elem) {
              return !isTag(elem) && data(elem.data);
            };
          } else {
            return function (elem) {
              return !isTag(elem) && elem.data === data;
            };
          }
        }
      };

      function getAttribCheck(attrib, value) {
        if (typeof value === "function") {
          return function (elem) {
            return elem.attribs && value(elem.attribs[attrib]);
          };
        } else {
          return function (elem) {
            return elem.attribs && elem.attribs[attrib] === value;
          };
        }
      }

      function combineFuncs(a, b) {
        return function (elem) {
          return a(elem) || b(elem);
        };
      }

      exports.getElements = function (options, element, recurse, limit) {
        var funcs = Object.keys(options).map(function (key) {
          var value = options[key];
          return key in Checks ? Checks[key](value) : getAttribCheck(key, value);
        });

        return funcs.length === 0 ? [] : this.filter(
          funcs.reduce(combineFuncs),
          element, recurse, limit
        );
      };

      exports.getElementById = function (id, element, recurse) {
        if (!Array.isArray(element)) {
          element = [element];
        }
        return this.findOne(getAttribCheck("id", id), element, recurse !== false);
      };

      exports.getElementsByTagName = function (name, element, recurse, limit) {
        return this.filter(Checks.tag_name(name), element, recurse, limit);
      };

      exports.getElementsByTagType = function (type, element, recurse, limit) {
        return this.filter(Checks.tag_type(type), element, recurse, limit);
      };

    }, { "domelementtype": 15 }],
    22: [function (require, module, exports) {
      exports.removeElement = function (elem) {
        if (elem.prev) {
          elem.prev.next = elem.next;
        }
        if (elem.next) {
          elem.next.prev = elem.prev;
        }

        if (elem.parent) {
          var childs = elem.parent.children;
          childs.splice(childs.lastIndexOf(elem), 1);
        }
      };

      exports.replaceElement = function (elem, replacement) {
        var prev = replacement.prev = elem.prev;
        if (prev) {
          prev.next = replacement;
        }

        var next = replacement.next = elem.next;
        if (next) {
          next.prev = replacement;
        }

        var parent = replacement.parent = elem.parent;
        if (parent) {
          var childs = parent.children;
          childs[childs.lastIndexOf(elem)] = replacement;
        }
      };

      exports.appendChild = function (elem, child) {
        child.parent = elem;

        if (elem.children.push(child) !== 1) {
          var sibling = elem.children[elem.children.length - 2];
          sibling.next = child;
          child.prev = sibling;
          child.next = null;
        }
      };

      exports.append = function (elem, next) {
        var parent = elem.parent,
          currNext = elem.next;

        next.next = currNext;
        next.prev = elem;
        elem.next = next;
        next.parent = parent;

        if (currNext) {
          currNext.prev = next;
          if (parent) {
            var childs = parent.children;
            childs.splice(childs.lastIndexOf(currNext), 0, next);
          }
        } else if (parent) {
          parent.children.push(next);
        }
      };

      exports.prepend = function (elem, prev) {
        var parent = elem.parent;
        if (parent) {
          var childs = parent.children;
          childs.splice(childs.lastIndexOf(elem), 0, prev);
        }

        if (elem.prev) {
          elem.prev.next = prev;
        }

        prev.parent = parent;
        prev.prev = elem.prev;
        prev.next = elem;
        elem.prev = prev;
      };


    }, {}],
    23: [function (require, module, exports) {
      var isTag = require("domelementtype").isTag;

      module.exports = {
        filter: filter,
        find: find,
        findOneChild: findOneChild,
        findOne: findOne,
        existsOne: existsOne,
        findAll: findAll
      };

      function filter(test, element, recurse, limit) {
        if (!Array.isArray(element)) {
          element = [element];
        }

        if (typeof limit !== "number" || !isFinite(limit)) {
          limit = Infinity;
        }
        return find(test, element, recurse !== false, limit);
      }

      function find(test, elems, recurse, limit) {
        var result = [], childs;

        for (var i = 0, j = elems.length; i < j; i++) {
          if (test(elems[i])) {
            result.push(elems[i]);
            if (--limit <= 0) {
              break;
            }
          }

          childs = elems[i].children;
          if (recurse && childs && childs.length > 0) {
            childs = find(test, childs, recurse, limit);
            result = result.concat(childs);
            limit -= childs.length;
            if (limit <= 0) {
              break;
            }
          }
        }

        return result;
      }

      function findOneChild(test, elems) {
        for (var i = 0, l = elems.length; i < l; i++) {
          if (test(elems[i])) {
            return elems[i];
          }
        }

        return null;
      }

      function findOne(test, elems) {
        var elem = null;

        for (var i = 0, l = elems.length; i < l && !elem; i++) {
          if (!isTag(elems[i])) {
            continue;
          } else if (test(elems[i])) {
            elem = elems[i];
          } else if (elems[i].children.length > 0) {
            elem = findOne(test, elems[i].children);
          }
        }

        return elem;
      }

      function existsOne(test, elems) {
        for (var i = 0, l = elems.length; i < l; i++) {
          if (
            isTag(elems[i]) && (
              test(elems[i]) || (
                elems[i].children.length > 0 &&
                existsOne(test, elems[i].children)
              )
            )
          )
          {
            return true;
          }
        }

        return false;
      }

      function findAll(test, rootElems) {
        var result = [];
        var stack = rootElems.slice();
        while (stack.length) {
          var elem = stack.shift();
          if (!isTag(elem)) {
            continue;
          }
          if (elem.children && elem.children.length > 0) {
            stack.unshift.apply(stack, elem.children);
          }
          if (test(elem)) {
            result.push(elem);
          }
        }
        return result;
      }

    }, { "domelementtype": 15 }],
    24: [function (require, module, exports) {
      var ElementType = require("domelementtype"),
        getOuterHTML = require("dom-serializer"),
        isTag = ElementType.isTag;

      module.exports = {
        getInnerHTML: getInnerHTML,
        getOuterHTML: getOuterHTML,
        getText: getText
      };

      function getInnerHTML(elem, opts) {
        return elem.children ? elem.children.map(function (elem) {
          return getOuterHTML(elem, opts);
        }).join("") : "";
      }

      function getText(elem) {
        if (Array.isArray(elem)) {
          return elem.map(getText).join("");
        }
        if (isTag(elem)) {
          return elem.name === "br" ? "\n" : getText(elem.children);
        }
        if (elem.type === ElementType.CDATA) {
          return getText(elem.children);
        }
        if (elem.type === ElementType.Text) {
          return elem.data;
        }
        return "";
      }

    }, { "dom-serializer": 14, "domelementtype": 15 }],
    25: [function (require, module, exports) {
      var getChildren = exports.getChildren = function (elem) {
        return elem.children;
      };

      var getParent = exports.getParent = function (elem) {
        return elem.parent;
      };

      exports.getSiblings = function (elem) {
        var parent = getParent(elem);
        return parent ? getChildren(parent) : [elem];
      };

      exports.getAttributeValue = function (elem, name) {
        return elem.attribs && elem.attribs[name];
      };

      exports.hasAttrib = function (elem, name) {
        return !!elem.attribs && hasOwnProperty.call(elem.attribs, name);
      };

      exports.getName = function (elem) {
        return elem.name;
      };

    }, {}],
    26: [function (require, module, exports) {
      var encode = require("./lib/encode.js"),
        decode = require("./lib/decode.js");

      exports.decode = function (data, level) {
        return (!level || level <= 0 ? decode.XML : decode.HTML)(data);
      };

      exports.decodeStrict = function (data, level) {
        return (!level || level <= 0 ? decode.XML : decode.HTMLStrict)(data);
      };

      exports.encode = function (data, level) {
        return (!level || level <= 0 ? encode.XML : encode.HTML)(data);
      };

      exports.encodeXML = encode.XML;

      exports.encodeHTML4 = exports.encodeHTML5 = exports.encodeHTML = encode.HTML;

      exports.decodeXML = exports.decodeXMLStrict = decode.XML;

      exports.decodeHTML4 = exports.decodeHTML5 = exports.decodeHTML = decode.HTML;

      exports.decodeHTML4Strict = exports.decodeHTML5Strict = exports.decodeHTMLStrict = decode.HTMLStrict;

      exports.escape = encode.escape;

    }, { "./lib/decode.js": 27, "./lib/encode.js": 29 }],
    27: [function (require, module, exports) {
      var entityMap = require("../maps/entities.json"),
        legacyMap = require("../maps/legacy.json"),
        xmlMap = require("../maps/xml.json"),
        decodeCodePoint = require("./decode_codepoint.js");

      var decodeXMLStrict = getStrictDecoder(xmlMap),
        decodeHTMLStrict = getStrictDecoder(entityMap);

      function getStrictDecoder(map) {
        var keys = Object.keys(map).join("|"),
          replace = getReplacer(map);

        keys += "|#[xX][\\da-fA-F]+|#\\d+";

        var re = new RegExp("&(?:" + keys + ");", "g");

        return function (str) {
          return String(str).replace(re, replace);
        };
      }

      var decodeHTML = (function () {
        var legacy = Object.keys(legacyMap).sort(sorter);

        var keys = Object.keys(entityMap).sort(sorter);

        for (var i = 0, j = 0; i < keys.length; i++) {
          if (legacy[j] === keys[i]) {
            keys[i] += ";?";
            j++;
          } else {
            keys[i] += ";";
          }
        }

        var re = new RegExp("&(?:" + keys.join("|") + "|#[xX][\\da-fA-F]+;?|#\\d+;?)", "g"),
          replace = getReplacer(entityMap);

        function replacer(str) {
          if (str.substr(-1) !== ";") {
            str += ";";
          }
          return replace(str);
        }

        //TODO consider creating a merged map
        return function (str) {
          return String(str).replace(re, replacer);
        };
      })();

      function sorter(a, b) {
        return a < b ? 1 : -1;
      }

      function getReplacer(map) {
        return function replace(str) {
          if (str.charAt(1) === "#") {
            if (str.charAt(2) === "X" || str.charAt(2) === "x") {
              return decodeCodePoint(parseInt(str.substr(3), 16));
            }
            return decodeCodePoint(parseInt(str.substr(2), 10));
          }
          return map[str.slice(1, -1)];
        };
      }

      module.exports = {
        XML: decodeXMLStrict,
        HTML: decodeHTML,
        HTMLStrict: decodeHTMLStrict
      };

    }, { "../maps/entities.json": 31, "../maps/legacy.json": 32, "../maps/xml.json": 33, "./decode_codepoint.js": 28 }],
    28: [function (require, module, exports) {
      var decodeMap = require("../maps/decode.json");

      module.exports = decodeCodePoint;

// modified version of https://github.com/mathiasbynens/he/blob/master/src/he.js#L94-L119
      function decodeCodePoint(codePoint) {
        if ((codePoint >= 0xd800 && codePoint <= 0xdfff) || codePoint > 0x10ffff) {
          return "\uFFFD";
        }

        if (codePoint in decodeMap) {
          codePoint = decodeMap[codePoint];
        }

        var output = "";

        if (codePoint > 0xffff) {
          codePoint -= 0x10000;
          output += String.fromCharCode(((codePoint >>> 10) & 0x3ff) | 0xd800);
          codePoint = 0xdc00 | (codePoint & 0x3ff);
        }

        output += String.fromCharCode(codePoint);
        return output;
      }

    }, { "../maps/decode.json": 30 }],
    29: [function (require, module, exports) {
      var inverseXML = getInverseObj(require("../maps/xml.json")),
        xmlReplacer = getInverseReplacer(inverseXML);

      exports.XML = getInverse(inverseXML, xmlReplacer);

      var inverseHTML = getInverseObj(require("../maps/entities.json")),
        htmlReplacer = getInverseReplacer(inverseHTML);

      exports.HTML = getInverse(inverseHTML, htmlReplacer);

      function getInverseObj(obj) {
        return Object.keys(obj)
          .sort()
          .reduce(function (inverse, name) {
            inverse[obj[name]] = "&" + name + ";";
            return inverse;
          }, {});
      }

      function getInverseReplacer(inverse) {
        var single = [],
          multiple = [];

        Object.keys(inverse).forEach(function (k) {
          if (k.length === 1) {
            single.push("\\" + k);
          } else {
            multiple.push(k);
          }
        });

        //TODO add ranges
        multiple.unshift("[" + single.join("") + "]");

        return new RegExp(multiple.join("|"), "g");
      }

      var re_nonASCII = /[^\0-\x7F]/g,
        re_astralSymbols = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;

      function singleCharReplacer(c) {
        return (
          "&#x" +
          c
            .charCodeAt(0)
            .toString(16)
            .toUpperCase() +
          ";"
        );
      }

      function astralReplacer(c) {
        // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
        var high = c.charCodeAt(0);
        var low = c.charCodeAt(1);
        var codePoint = (high - 0xd800) * 0x400 + low - 0xdc00 + 0x10000;
        return "&#x" + codePoint.toString(16).toUpperCase() + ";";
      }

      function getInverse(inverse, re) {
        function func(name) {
          return inverse[name];
        }

        return function (data) {
          return data
            .replace(re, func)
            .replace(re_astralSymbols, astralReplacer)
            .replace(re_nonASCII, singleCharReplacer);
        };
      }

      var re_xmlChars = getInverseReplacer(inverseXML);

      function escapeXML(data) {
        return data
          .replace(re_xmlChars, singleCharReplacer)
          .replace(re_astralSymbols, astralReplacer)
          .replace(re_nonASCII, singleCharReplacer);
      }

      exports.escape = escapeXML;

    }, { "../maps/entities.json": 31, "../maps/xml.json": 33 }],
    30: [function (require, module, exports) {
      module.exports = {
        "0": 65533,
        "128": 8364,
        "130": 8218,
        "131": 402,
        "132": 8222,
        "133": 8230,
        "134": 8224,
        "135": 8225,
        "136": 710,
        "137": 8240,
        "138": 352,
        "139": 8249,
        "140": 338,
        "142": 381,
        "145": 8216,
        "146": 8217,
        "147": 8220,
        "148": 8221,
        "149": 8226,
        "150": 8211,
        "151": 8212,
        "152": 732,
        "153": 8482,
        "154": 353,
        "155": 8250,
        "156": 339,
        "158": 382,
        "159": 376
      }
    }, {}],
    31: [function (require, module, exports) {
      module.exports = {
        "Aacute": "\u00C1",
        "aacute": "\u00E1",
        "Abreve": "\u0102",
        "abreve": "\u0103",
        "ac": "\u223E",
        "acd": "\u223F",
        "acE": "\u223E\u0333",
        "Acirc": "\u00C2",
        "acirc": "\u00E2",
        "acute": "\u00B4",
        "Acy": "\u0410",
        "acy": "\u0430",
        "AElig": "\u00C6",
        "aelig": "\u00E6",
        "af": "\u2061",
        "Afr": "\uD835\uDD04",
        "afr": "\uD835\uDD1E",
        "Agrave": "\u00C0",
        "agrave": "\u00E0",
        "alefsym": "\u2135",
        "aleph": "\u2135",
        "Alpha": "\u0391",
        "alpha": "\u03B1",
        "Amacr": "\u0100",
        "amacr": "\u0101",
        "amalg": "\u2A3F",
        "amp": "&",
        "AMP": "&",
        "andand": "\u2A55",
        "And": "\u2A53",
        "and": "\u2227",
        "andd": "\u2A5C",
        "andslope": "\u2A58",
        "andv": "\u2A5A",
        "ang": "\u2220",
        "ange": "\u29A4",
        "angle": "\u2220",
        "angmsdaa": "\u29A8",
        "angmsdab": "\u29A9",
        "angmsdac": "\u29AA",
        "angmsdad": "\u29AB",
        "angmsdae": "\u29AC",
        "angmsdaf": "\u29AD",
        "angmsdag": "\u29AE",
        "angmsdah": "\u29AF",
        "angmsd": "\u2221",
        "angrt": "\u221F",
        "angrtvb": "\u22BE",
        "angrtvbd": "\u299D",
        "angsph": "\u2222",
        "angst": "\u00C5",
        "angzarr": "\u237C",
        "Aogon": "\u0104",
        "aogon": "\u0105",
        "Aopf": "\uD835\uDD38",
        "aopf": "\uD835\uDD52",
        "apacir": "\u2A6F",
        "ap": "\u2248",
        "apE": "\u2A70",
        "ape": "\u224A",
        "apid": "\u224B",
        "apos": "'",
        "ApplyFunction": "\u2061",
        "approx": "\u2248",
        "approxeq": "\u224A",
        "Aring": "\u00C5",
        "aring": "\u00E5",
        "Ascr": "\uD835\uDC9C",
        "ascr": "\uD835\uDCB6",
        "Assign": "\u2254",
        "ast": "*",
        "asymp": "\u2248",
        "asympeq": "\u224D",
        "Atilde": "\u00C3",
        "atilde": "\u00E3",
        "Auml": "\u00C4",
        "auml": "\u00E4",
        "awconint": "\u2233",
        "awint": "\u2A11",
        "backcong": "\u224C",
        "backepsilon": "\u03F6",
        "backprime": "\u2035",
        "backsim": "\u223D",
        "backsimeq": "\u22CD",
        "Backslash": "\u2216",
        "Barv": "\u2AE7",
        "barvee": "\u22BD",
        "barwed": "\u2305",
        "Barwed": "\u2306",
        "barwedge": "\u2305",
        "bbrk": "\u23B5",
        "bbrktbrk": "\u23B6",
        "bcong": "\u224C",
        "Bcy": "\u0411",
        "bcy": "\u0431",
        "bdquo": "\u201E",
        "becaus": "\u2235",
        "because": "\u2235",
        "Because": "\u2235",
        "bemptyv": "\u29B0",
        "bepsi": "\u03F6",
        "bernou": "\u212C",
        "Bernoullis": "\u212C",
        "Beta": "\u0392",
        "beta": "\u03B2",
        "beth": "\u2136",
        "between": "\u226C",
        "Bfr": "\uD835\uDD05",
        "bfr": "\uD835\uDD1F",
        "bigcap": "\u22C2",
        "bigcirc": "\u25EF",
        "bigcup": "\u22C3",
        "bigodot": "\u2A00",
        "bigoplus": "\u2A01",
        "bigotimes": "\u2A02",
        "bigsqcup": "\u2A06",
        "bigstar": "\u2605",
        "bigtriangledown": "\u25BD",
        "bigtriangleup": "\u25B3",
        "biguplus": "\u2A04",
        "bigvee": "\u22C1",
        "bigwedge": "\u22C0",
        "bkarow": "\u290D",
        "blacklozenge": "\u29EB",
        "blacksquare": "\u25AA",
        "blacktriangle": "\u25B4",
        "blacktriangledown": "\u25BE",
        "blacktriangleleft": "\u25C2",
        "blacktriangleright": "\u25B8",
        "blank": "\u2423",
        "blk12": "\u2592",
        "blk14": "\u2591",
        "blk34": "\u2593",
        "block": "\u2588",
        "bne": "=\u20E5",
        "bnequiv": "\u2261\u20E5",
        "bNot": "\u2AED",
        "bnot": "\u2310",
        "Bopf": "\uD835\uDD39",
        "bopf": "\uD835\uDD53",
        "bot": "\u22A5",
        "bottom": "\u22A5",
        "bowtie": "\u22C8",
        "boxbox": "\u29C9",
        "boxdl": "\u2510",
        "boxdL": "\u2555",
        "boxDl": "\u2556",
        "boxDL": "\u2557",
        "boxdr": "\u250C",
        "boxdR": "\u2552",
        "boxDr": "\u2553",
        "boxDR": "\u2554",
        "boxh": "\u2500",
        "boxH": "\u2550",
        "boxhd": "\u252C",
        "boxHd": "\u2564",
        "boxhD": "\u2565",
        "boxHD": "\u2566",
        "boxhu": "\u2534",
        "boxHu": "\u2567",
        "boxhU": "\u2568",
        "boxHU": "\u2569",
        "boxminus": "\u229F",
        "boxplus": "\u229E",
        "boxtimes": "\u22A0",
        "boxul": "\u2518",
        "boxuL": "\u255B",
        "boxUl": "\u255C",
        "boxUL": "\u255D",
        "boxur": "\u2514",
        "boxuR": "\u2558",
        "boxUr": "\u2559",
        "boxUR": "\u255A",
        "boxv": "\u2502",
        "boxV": "\u2551",
        "boxvh": "\u253C",
        "boxvH": "\u256A",
        "boxVh": "\u256B",
        "boxVH": "\u256C",
        "boxvl": "\u2524",
        "boxvL": "\u2561",
        "boxVl": "\u2562",
        "boxVL": "\u2563",
        "boxvr": "\u251C",
        "boxvR": "\u255E",
        "boxVr": "\u255F",
        "boxVR": "\u2560",
        "bprime": "\u2035",
        "breve": "\u02D8",
        "Breve": "\u02D8",
        "brvbar": "\u00A6",
        "bscr": "\uD835\uDCB7",
        "Bscr": "\u212C",
        "bsemi": "\u204F",
        "bsim": "\u223D",
        "bsime": "\u22CD",
        "bsolb": "\u29C5",
        "bsol": "\\",
        "bsolhsub": "\u27C8",
        "bull": "\u2022",
        "bullet": "\u2022",
        "bump": "\u224E",
        "bumpE": "\u2AAE",
        "bumpe": "\u224F",
        "Bumpeq": "\u224E",
        "bumpeq": "\u224F",
        "Cacute": "\u0106",
        "cacute": "\u0107",
        "capand": "\u2A44",
        "capbrcup": "\u2A49",
        "capcap": "\u2A4B",
        "cap": "\u2229",
        "Cap": "\u22D2",
        "capcup": "\u2A47",
        "capdot": "\u2A40",
        "CapitalDifferentialD": "\u2145",
        "caps": "\u2229\uFE00",
        "caret": "\u2041",
        "caron": "\u02C7",
        "Cayleys": "\u212D",
        "ccaps": "\u2A4D",
        "Ccaron": "\u010C",
        "ccaron": "\u010D",
        "Ccedil": "\u00C7",
        "ccedil": "\u00E7",
        "Ccirc": "\u0108",
        "ccirc": "\u0109",
        "Cconint": "\u2230",
        "ccups": "\u2A4C",
        "ccupssm": "\u2A50",
        "Cdot": "\u010A",
        "cdot": "\u010B",
        "cedil": "\u00B8",
        "Cedilla": "\u00B8",
        "cemptyv": "\u29B2",
        "cent": "\u00A2",
        "centerdot": "\u00B7",
        "CenterDot": "\u00B7",
        "cfr": "\uD835\uDD20",
        "Cfr": "\u212D",
        "CHcy": "\u0427",
        "chcy": "\u0447",
        "check": "\u2713",
        "checkmark": "\u2713",
        "Chi": "\u03A7",
        "chi": "\u03C7",
        "circ": "\u02C6",
        "circeq": "\u2257",
        "circlearrowleft": "\u21BA",
        "circlearrowright": "\u21BB",
        "circledast": "\u229B",
        "circledcirc": "\u229A",
        "circleddash": "\u229D",
        "CircleDot": "\u2299",
        "circledR": "\u00AE",
        "circledS": "\u24C8",
        "CircleMinus": "\u2296",
        "CirclePlus": "\u2295",
        "CircleTimes": "\u2297",
        "cir": "\u25CB",
        "cirE": "\u29C3",
        "cire": "\u2257",
        "cirfnint": "\u2A10",
        "cirmid": "\u2AEF",
        "cirscir": "\u29C2",
        "ClockwiseContourIntegral": "\u2232",
        "CloseCurlyDoubleQuote": "\u201D",
        "CloseCurlyQuote": "\u2019",
        "clubs": "\u2663",
        "clubsuit": "\u2663",
        "colon": ":",
        "Colon": "\u2237",
        "Colone": "\u2A74",
        "colone": "\u2254",
        "coloneq": "\u2254",
        "comma": ",",
        "commat": "@",
        "comp": "\u2201",
        "compfn": "\u2218",
        "complement": "\u2201",
        "complexes": "\u2102",
        "cong": "\u2245",
        "congdot": "\u2A6D",
        "Congruent": "\u2261",
        "conint": "\u222E",
        "Conint": "\u222F",
        "ContourIntegral": "\u222E",
        "copf": "\uD835\uDD54",
        "Copf": "\u2102",
        "coprod": "\u2210",
        "Coproduct": "\u2210",
        "copy": "\u00A9",
        "COPY": "\u00A9",
        "copysr": "\u2117",
        "CounterClockwiseContourIntegral": "\u2233",
        "crarr": "\u21B5",
        "cross": "\u2717",
        "Cross": "\u2A2F",
        "Cscr": "\uD835\uDC9E",
        "cscr": "\uD835\uDCB8",
        "csub": "\u2ACF",
        "csube": "\u2AD1",
        "csup": "\u2AD0",
        "csupe": "\u2AD2",
        "ctdot": "\u22EF",
        "cudarrl": "\u2938",
        "cudarrr": "\u2935",
        "cuepr": "\u22DE",
        "cuesc": "\u22DF",
        "cularr": "\u21B6",
        "cularrp": "\u293D",
        "cupbrcap": "\u2A48",
        "cupcap": "\u2A46",
        "CupCap": "\u224D",
        "cup": "\u222A",
        "Cup": "\u22D3",
        "cupcup": "\u2A4A",
        "cupdot": "\u228D",
        "cupor": "\u2A45",
        "cups": "\u222A\uFE00",
        "curarr": "\u21B7",
        "curarrm": "\u293C",
        "curlyeqprec": "\u22DE",
        "curlyeqsucc": "\u22DF",
        "curlyvee": "\u22CE",
        "curlywedge": "\u22CF",
        "curren": "\u00A4",
        "curvearrowleft": "\u21B6",
        "curvearrowright": "\u21B7",
        "cuvee": "\u22CE",
        "cuwed": "\u22CF",
        "cwconint": "\u2232",
        "cwint": "\u2231",
        "cylcty": "\u232D",
        "dagger": "\u2020",
        "Dagger": "\u2021",
        "daleth": "\u2138",
        "darr": "\u2193",
        "Darr": "\u21A1",
        "dArr": "\u21D3",
        "dash": "\u2010",
        "Dashv": "\u2AE4",
        "dashv": "\u22A3",
        "dbkarow": "\u290F",
        "dblac": "\u02DD",
        "Dcaron": "\u010E",
        "dcaron": "\u010F",
        "Dcy": "\u0414",
        "dcy": "\u0434",
        "ddagger": "\u2021",
        "ddarr": "\u21CA",
        "DD": "\u2145",
        "dd": "\u2146",
        "DDotrahd": "\u2911",
        "ddotseq": "\u2A77",
        "deg": "\u00B0",
        "Del": "\u2207",
        "Delta": "\u0394",
        "delta": "\u03B4",
        "demptyv": "\u29B1",
        "dfisht": "\u297F",
        "Dfr": "\uD835\uDD07",
        "dfr": "\uD835\uDD21",
        "dHar": "\u2965",
        "dharl": "\u21C3",
        "dharr": "\u21C2",
        "DiacriticalAcute": "\u00B4",
        "DiacriticalDot": "\u02D9",
        "DiacriticalDoubleAcute": "\u02DD",
        "DiacriticalGrave": "`",
        "DiacriticalTilde": "\u02DC",
        "diam": "\u22C4",
        "diamond": "\u22C4",
        "Diamond": "\u22C4",
        "diamondsuit": "\u2666",
        "diams": "\u2666",
        "die": "\u00A8",
        "DifferentialD": "\u2146",
        "digamma": "\u03DD",
        "disin": "\u22F2",
        "div": "\u00F7",
        "divide": "\u00F7",
        "divideontimes": "\u22C7",
        "divonx": "\u22C7",
        "DJcy": "\u0402",
        "djcy": "\u0452",
        "dlcorn": "\u231E",
        "dlcrop": "\u230D",
        "dollar": "$",
        "Dopf": "\uD835\uDD3B",
        "dopf": "\uD835\uDD55",
        "Dot": "\u00A8",
        "dot": "\u02D9",
        "DotDot": "\u20DC",
        "doteq": "\u2250",
        "doteqdot": "\u2251",
        "DotEqual": "\u2250",
        "dotminus": "\u2238",
        "dotplus": "\u2214",
        "dotsquare": "\u22A1",
        "doublebarwedge": "\u2306",
        "DoubleContourIntegral": "\u222F",
        "DoubleDot": "\u00A8",
        "DoubleDownArrow": "\u21D3",
        "DoubleLeftArrow": "\u21D0",
        "DoubleLeftRightArrow": "\u21D4",
        "DoubleLeftTee": "\u2AE4",
        "DoubleLongLeftArrow": "\u27F8",
        "DoubleLongLeftRightArrow": "\u27FA",
        "DoubleLongRightArrow": "\u27F9",
        "DoubleRightArrow": "\u21D2",
        "DoubleRightTee": "\u22A8",
        "DoubleUpArrow": "\u21D1",
        "DoubleUpDownArrow": "\u21D5",
        "DoubleVerticalBar": "\u2225",
        "DownArrowBar": "\u2913",
        "downarrow": "\u2193",
        "DownArrow": "\u2193",
        "Downarrow": "\u21D3",
        "DownArrowUpArrow": "\u21F5",
        "DownBreve": "\u0311",
        "downdownarrows": "\u21CA",
        "downharpoonleft": "\u21C3",
        "downharpoonright": "\u21C2",
        "DownLeftRightVector": "\u2950",
        "DownLeftTeeVector": "\u295E",
        "DownLeftVectorBar": "\u2956",
        "DownLeftVector": "\u21BD",
        "DownRightTeeVector": "\u295F",
        "DownRightVectorBar": "\u2957",
        "DownRightVector": "\u21C1",
        "DownTeeArrow": "\u21A7",
        "DownTee": "\u22A4",
        "drbkarow": "\u2910",
        "drcorn": "\u231F",
        "drcrop": "\u230C",
        "Dscr": "\uD835\uDC9F",
        "dscr": "\uD835\uDCB9",
        "DScy": "\u0405",
        "dscy": "\u0455",
        "dsol": "\u29F6",
        "Dstrok": "\u0110",
        "dstrok": "\u0111",
        "dtdot": "\u22F1",
        "dtri": "\u25BF",
        "dtrif": "\u25BE",
        "duarr": "\u21F5",
        "duhar": "\u296F",
        "dwangle": "\u29A6",
        "DZcy": "\u040F",
        "dzcy": "\u045F",
        "dzigrarr": "\u27FF",
        "Eacute": "\u00C9",
        "eacute": "\u00E9",
        "easter": "\u2A6E",
        "Ecaron": "\u011A",
        "ecaron": "\u011B",
        "Ecirc": "\u00CA",
        "ecirc": "\u00EA",
        "ecir": "\u2256",
        "ecolon": "\u2255",
        "Ecy": "\u042D",
        "ecy": "\u044D",
        "eDDot": "\u2A77",
        "Edot": "\u0116",
        "edot": "\u0117",
        "eDot": "\u2251",
        "ee": "\u2147",
        "efDot": "\u2252",
        "Efr": "\uD835\uDD08",
        "efr": "\uD835\uDD22",
        "eg": "\u2A9A",
        "Egrave": "\u00C8",
        "egrave": "\u00E8",
        "egs": "\u2A96",
        "egsdot": "\u2A98",
        "el": "\u2A99",
        "Element": "\u2208",
        "elinters": "\u23E7",
        "ell": "\u2113",
        "els": "\u2A95",
        "elsdot": "\u2A97",
        "Emacr": "\u0112",
        "emacr": "\u0113",
        "empty": "\u2205",
        "emptyset": "\u2205",
        "EmptySmallSquare": "\u25FB",
        "emptyv": "\u2205",
        "EmptyVerySmallSquare": "\u25AB",
        "emsp13": "\u2004",
        "emsp14": "\u2005",
        "emsp": "\u2003",
        "ENG": "\u014A",
        "eng": "\u014B",
        "ensp": "\u2002",
        "Eogon": "\u0118",
        "eogon": "\u0119",
        "Eopf": "\uD835\uDD3C",
        "eopf": "\uD835\uDD56",
        "epar": "\u22D5",
        "eparsl": "\u29E3",
        "eplus": "\u2A71",
        "epsi": "\u03B5",
        "Epsilon": "\u0395",
        "epsilon": "\u03B5",
        "epsiv": "\u03F5",
        "eqcirc": "\u2256",
        "eqcolon": "\u2255",
        "eqsim": "\u2242",
        "eqslantgtr": "\u2A96",
        "eqslantless": "\u2A95",
        "Equal": "\u2A75",
        "equals": "=",
        "EqualTilde": "\u2242",
        "equest": "\u225F",
        "Equilibrium": "\u21CC",
        "equiv": "\u2261",
        "equivDD": "\u2A78",
        "eqvparsl": "\u29E5",
        "erarr": "\u2971",
        "erDot": "\u2253",
        "escr": "\u212F",
        "Escr": "\u2130",
        "esdot": "\u2250",
        "Esim": "\u2A73",
        "esim": "\u2242",
        "Eta": "\u0397",
        "eta": "\u03B7",
        "ETH": "\u00D0",
        "eth": "\u00F0",
        "Euml": "\u00CB",
        "euml": "\u00EB",
        "euro": "\u20AC",
        "excl": "!",
        "exist": "\u2203",
        "Exists": "\u2203",
        "expectation": "\u2130",
        "exponentiale": "\u2147",
        "ExponentialE": "\u2147",
        "fallingdotseq": "\u2252",
        "Fcy": "\u0424",
        "fcy": "\u0444",
        "female": "\u2640",
        "ffilig": "\uFB03",
        "fflig": "\uFB00",
        "ffllig": "\uFB04",
        "Ffr": "\uD835\uDD09",
        "ffr": "\uD835\uDD23",
        "filig": "\uFB01",
        "FilledSmallSquare": "\u25FC",
        "FilledVerySmallSquare": "\u25AA",
        "fjlig": "fj",
        "flat": "\u266D",
        "fllig": "\uFB02",
        "fltns": "\u25B1",
        "fnof": "\u0192",
        "Fopf": "\uD835\uDD3D",
        "fopf": "\uD835\uDD57",
        "forall": "\u2200",
        "ForAll": "\u2200",
        "fork": "\u22D4",
        "forkv": "\u2AD9",
        "Fouriertrf": "\u2131",
        "fpartint": "\u2A0D",
        "frac12": "\u00BD",
        "frac13": "\u2153",
        "frac14": "\u00BC",
        "frac15": "\u2155",
        "frac16": "\u2159",
        "frac18": "\u215B",
        "frac23": "\u2154",
        "frac25": "\u2156",
        "frac34": "\u00BE",
        "frac35": "\u2157",
        "frac38": "\u215C",
        "frac45": "\u2158",
        "frac56": "\u215A",
        "frac58": "\u215D",
        "frac78": "\u215E",
        "frasl": "\u2044",
        "frown": "\u2322",
        "fscr": "\uD835\uDCBB",
        "Fscr": "\u2131",
        "gacute": "\u01F5",
        "Gamma": "\u0393",
        "gamma": "\u03B3",
        "Gammad": "\u03DC",
        "gammad": "\u03DD",
        "gap": "\u2A86",
        "Gbreve": "\u011E",
        "gbreve": "\u011F",
        "Gcedil": "\u0122",
        "Gcirc": "\u011C",
        "gcirc": "\u011D",
        "Gcy": "\u0413",
        "gcy": "\u0433",
        "Gdot": "\u0120",
        "gdot": "\u0121",
        "ge": "\u2265",
        "gE": "\u2267",
        "gEl": "\u2A8C",
        "gel": "\u22DB",
        "geq": "\u2265",
        "geqq": "\u2267",
        "geqslant": "\u2A7E",
        "gescc": "\u2AA9",
        "ges": "\u2A7E",
        "gesdot": "\u2A80",
        "gesdoto": "\u2A82",
        "gesdotol": "\u2A84",
        "gesl": "\u22DB\uFE00",
        "gesles": "\u2A94",
        "Gfr": "\uD835\uDD0A",
        "gfr": "\uD835\uDD24",
        "gg": "\u226B",
        "Gg": "\u22D9",
        "ggg": "\u22D9",
        "gimel": "\u2137",
        "GJcy": "\u0403",
        "gjcy": "\u0453",
        "gla": "\u2AA5",
        "gl": "\u2277",
        "glE": "\u2A92",
        "glj": "\u2AA4",
        "gnap": "\u2A8A",
        "gnapprox": "\u2A8A",
        "gne": "\u2A88",
        "gnE": "\u2269",
        "gneq": "\u2A88",
        "gneqq": "\u2269",
        "gnsim": "\u22E7",
        "Gopf": "\uD835\uDD3E",
        "gopf": "\uD835\uDD58",
        "grave": "`",
        "GreaterEqual": "\u2265",
        "GreaterEqualLess": "\u22DB",
        "GreaterFullEqual": "\u2267",
        "GreaterGreater": "\u2AA2",
        "GreaterLess": "\u2277",
        "GreaterSlantEqual": "\u2A7E",
        "GreaterTilde": "\u2273",
        "Gscr": "\uD835\uDCA2",
        "gscr": "\u210A",
        "gsim": "\u2273",
        "gsime": "\u2A8E",
        "gsiml": "\u2A90",
        "gtcc": "\u2AA7",
        "gtcir": "\u2A7A",
        "gt": ">",
        "GT": ">",
        "Gt": "\u226B",
        "gtdot": "\u22D7",
        "gtlPar": "\u2995",
        "gtquest": "\u2A7C",
        "gtrapprox": "\u2A86",
        "gtrarr": "\u2978",
        "gtrdot": "\u22D7",
        "gtreqless": "\u22DB",
        "gtreqqless": "\u2A8C",
        "gtrless": "\u2277",
        "gtrsim": "\u2273",
        "gvertneqq": "\u2269\uFE00",
        "gvnE": "\u2269\uFE00",
        "Hacek": "\u02C7",
        "hairsp": "\u200A",
        "half": "\u00BD",
        "hamilt": "\u210B",
        "HARDcy": "\u042A",
        "hardcy": "\u044A",
        "harrcir": "\u2948",
        "harr": "\u2194",
        "hArr": "\u21D4",
        "harrw": "\u21AD",
        "Hat": "^",
        "hbar": "\u210F",
        "Hcirc": "\u0124",
        "hcirc": "\u0125",
        "hearts": "\u2665",
        "heartsuit": "\u2665",
        "hellip": "\u2026",
        "hercon": "\u22B9",
        "hfr": "\uD835\uDD25",
        "Hfr": "\u210C",
        "HilbertSpace": "\u210B",
        "hksearow": "\u2925",
        "hkswarow": "\u2926",
        "hoarr": "\u21FF",
        "homtht": "\u223B",
        "hookleftarrow": "\u21A9",
        "hookrightarrow": "\u21AA",
        "hopf": "\uD835\uDD59",
        "Hopf": "\u210D",
        "horbar": "\u2015",
        "HorizontalLine": "\u2500",
        "hscr": "\uD835\uDCBD",
        "Hscr": "\u210B",
        "hslash": "\u210F",
        "Hstrok": "\u0126",
        "hstrok": "\u0127",
        "HumpDownHump": "\u224E",
        "HumpEqual": "\u224F",
        "hybull": "\u2043",
        "hyphen": "\u2010",
        "Iacute": "\u00CD",
        "iacute": "\u00ED",
        "ic": "\u2063",
        "Icirc": "\u00CE",
        "icirc": "\u00EE",
        "Icy": "\u0418",
        "icy": "\u0438",
        "Idot": "\u0130",
        "IEcy": "\u0415",
        "iecy": "\u0435",
        "iexcl": "\u00A1",
        "iff": "\u21D4",
        "ifr": "\uD835\uDD26",
        "Ifr": "\u2111",
        "Igrave": "\u00CC",
        "igrave": "\u00EC",
        "ii": "\u2148",
        "iiiint": "\u2A0C",
        "iiint": "\u222D",
        "iinfin": "\u29DC",
        "iiota": "\u2129",
        "IJlig": "\u0132",
        "ijlig": "\u0133",
        "Imacr": "\u012A",
        "imacr": "\u012B",
        "image": "\u2111",
        "ImaginaryI": "\u2148",
        "imagline": "\u2110",
        "imagpart": "\u2111",
        "imath": "\u0131",
        "Im": "\u2111",
        "imof": "\u22B7",
        "imped": "\u01B5",
        "Implies": "\u21D2",
        "incare": "\u2105",
        "in": "\u2208",
        "infin": "\u221E",
        "infintie": "\u29DD",
        "inodot": "\u0131",
        "intcal": "\u22BA",
        "int": "\u222B",
        "Int": "\u222C",
        "integers": "\u2124",
        "Integral": "\u222B",
        "intercal": "\u22BA",
        "Intersection": "\u22C2",
        "intlarhk": "\u2A17",
        "intprod": "\u2A3C",
        "InvisibleComma": "\u2063",
        "InvisibleTimes": "\u2062",
        "IOcy": "\u0401",
        "iocy": "\u0451",
        "Iogon": "\u012E",
        "iogon": "\u012F",
        "Iopf": "\uD835\uDD40",
        "iopf": "\uD835\uDD5A",
        "Iota": "\u0399",
        "iota": "\u03B9",
        "iprod": "\u2A3C",
        "iquest": "\u00BF",
        "iscr": "\uD835\uDCBE",
        "Iscr": "\u2110",
        "isin": "\u2208",
        "isindot": "\u22F5",
        "isinE": "\u22F9",
        "isins": "\u22F4",
        "isinsv": "\u22F3",
        "isinv": "\u2208",
        "it": "\u2062",
        "Itilde": "\u0128",
        "itilde": "\u0129",
        "Iukcy": "\u0406",
        "iukcy": "\u0456",
        "Iuml": "\u00CF",
        "iuml": "\u00EF",
        "Jcirc": "\u0134",
        "jcirc": "\u0135",
        "Jcy": "\u0419",
        "jcy": "\u0439",
        "Jfr": "\uD835\uDD0D",
        "jfr": "\uD835\uDD27",
        "jmath": "\u0237",
        "Jopf": "\uD835\uDD41",
        "jopf": "\uD835\uDD5B",
        "Jscr": "\uD835\uDCA5",
        "jscr": "\uD835\uDCBF",
        "Jsercy": "\u0408",
        "jsercy": "\u0458",
        "Jukcy": "\u0404",
        "jukcy": "\u0454",
        "Kappa": "\u039A",
        "kappa": "\u03BA",
        "kappav": "\u03F0",
        "Kcedil": "\u0136",
        "kcedil": "\u0137",
        "Kcy": "\u041A",
        "kcy": "\u043A",
        "Kfr": "\uD835\uDD0E",
        "kfr": "\uD835\uDD28",
        "kgreen": "\u0138",
        "KHcy": "\u0425",
        "khcy": "\u0445",
        "KJcy": "\u040C",
        "kjcy": "\u045C",
        "Kopf": "\uD835\uDD42",
        "kopf": "\uD835\uDD5C",
        "Kscr": "\uD835\uDCA6",
        "kscr": "\uD835\uDCC0",
        "lAarr": "\u21DA",
        "Lacute": "\u0139",
        "lacute": "\u013A",
        "laemptyv": "\u29B4",
        "lagran": "\u2112",
        "Lambda": "\u039B",
        "lambda": "\u03BB",
        "lang": "\u27E8",
        "Lang": "\u27EA",
        "langd": "\u2991",
        "langle": "\u27E8",
        "lap": "\u2A85",
        "Laplacetrf": "\u2112",
        "laquo": "\u00AB",
        "larrb": "\u21E4",
        "larrbfs": "\u291F",
        "larr": "\u2190",
        "Larr": "\u219E",
        "lArr": "\u21D0",
        "larrfs": "\u291D",
        "larrhk": "\u21A9",
        "larrlp": "\u21AB",
        "larrpl": "\u2939",
        "larrsim": "\u2973",
        "larrtl": "\u21A2",
        "latail": "\u2919",
        "lAtail": "\u291B",
        "lat": "\u2AAB",
        "late": "\u2AAD",
        "lates": "\u2AAD\uFE00",
        "lbarr": "\u290C",
        "lBarr": "\u290E",
        "lbbrk": "\u2772",
        "lbrace": "{",
        "lbrack": "[",
        "lbrke": "\u298B",
        "lbrksld": "\u298F",
        "lbrkslu": "\u298D",
        "Lcaron": "\u013D",
        "lcaron": "\u013E",
        "Lcedil": "\u013B",
        "lcedil": "\u013C",
        "lceil": "\u2308",
        "lcub": "{",
        "Lcy": "\u041B",
        "lcy": "\u043B",
        "ldca": "\u2936",
        "ldquo": "\u201C",
        "ldquor": "\u201E",
        "ldrdhar": "\u2967",
        "ldrushar": "\u294B",
        "ldsh": "\u21B2",
        "le": "\u2264",
        "lE": "\u2266",
        "LeftAngleBracket": "\u27E8",
        "LeftArrowBar": "\u21E4",
        "leftarrow": "\u2190",
        "LeftArrow": "\u2190",
        "Leftarrow": "\u21D0",
        "LeftArrowRightArrow": "\u21C6",
        "leftarrowtail": "\u21A2",
        "LeftCeiling": "\u2308",
        "LeftDoubleBracket": "\u27E6",
        "LeftDownTeeVector": "\u2961",
        "LeftDownVectorBar": "\u2959",
        "LeftDownVector": "\u21C3",
        "LeftFloor": "\u230A",
        "leftharpoondown": "\u21BD",
        "leftharpoonup": "\u21BC",
        "leftleftarrows": "\u21C7",
        "leftrightarrow": "\u2194",
        "LeftRightArrow": "\u2194",
        "Leftrightarrow": "\u21D4",
        "leftrightarrows": "\u21C6",
        "leftrightharpoons": "\u21CB",
        "leftrightsquigarrow": "\u21AD",
        "LeftRightVector": "\u294E",
        "LeftTeeArrow": "\u21A4",
        "LeftTee": "\u22A3",
        "LeftTeeVector": "\u295A",
        "leftthreetimes": "\u22CB",
        "LeftTriangleBar": "\u29CF",
        "LeftTriangle": "\u22B2",
        "LeftTriangleEqual": "\u22B4",
        "LeftUpDownVector": "\u2951",
        "LeftUpTeeVector": "\u2960",
        "LeftUpVectorBar": "\u2958",
        "LeftUpVector": "\u21BF",
        "LeftVectorBar": "\u2952",
        "LeftVector": "\u21BC",
        "lEg": "\u2A8B",
        "leg": "\u22DA",
        "leq": "\u2264",
        "leqq": "\u2266",
        "leqslant": "\u2A7D",
        "lescc": "\u2AA8",
        "les": "\u2A7D",
        "lesdot": "\u2A7F",
        "lesdoto": "\u2A81",
        "lesdotor": "\u2A83",
        "lesg": "\u22DA\uFE00",
        "lesges": "\u2A93",
        "lessapprox": "\u2A85",
        "lessdot": "\u22D6",
        "lesseqgtr": "\u22DA",
        "lesseqqgtr": "\u2A8B",
        "LessEqualGreater": "\u22DA",
        "LessFullEqual": "\u2266",
        "LessGreater": "\u2276",
        "lessgtr": "\u2276",
        "LessLess": "\u2AA1",
        "lesssim": "\u2272",
        "LessSlantEqual": "\u2A7D",
        "LessTilde": "\u2272",
        "lfisht": "\u297C",
        "lfloor": "\u230A",
        "Lfr": "\uD835\uDD0F",
        "lfr": "\uD835\uDD29",
        "lg": "\u2276",
        "lgE": "\u2A91",
        "lHar": "\u2962",
        "lhard": "\u21BD",
        "lharu": "\u21BC",
        "lharul": "\u296A",
        "lhblk": "\u2584",
        "LJcy": "\u0409",
        "ljcy": "\u0459",
        "llarr": "\u21C7",
        "ll": "\u226A",
        "Ll": "\u22D8",
        "llcorner": "\u231E",
        "Lleftarrow": "\u21DA",
        "llhard": "\u296B",
        "lltri": "\u25FA",
        "Lmidot": "\u013F",
        "lmidot": "\u0140",
        "lmoustache": "\u23B0",
        "lmoust": "\u23B0",
        "lnap": "\u2A89",
        "lnapprox": "\u2A89",
        "lne": "\u2A87",
        "lnE": "\u2268",
        "lneq": "\u2A87",
        "lneqq": "\u2268",
        "lnsim": "\u22E6",
        "loang": "\u27EC",
        "loarr": "\u21FD",
        "lobrk": "\u27E6",
        "longleftarrow": "\u27F5",
        "LongLeftArrow": "\u27F5",
        "Longleftarrow": "\u27F8",
        "longleftrightarrow": "\u27F7",
        "LongLeftRightArrow": "\u27F7",
        "Longleftrightarrow": "\u27FA",
        "longmapsto": "\u27FC",
        "longrightarrow": "\u27F6",
        "LongRightArrow": "\u27F6",
        "Longrightarrow": "\u27F9",
        "looparrowleft": "\u21AB",
        "looparrowright": "\u21AC",
        "lopar": "\u2985",
        "Lopf": "\uD835\uDD43",
        "lopf": "\uD835\uDD5D",
        "loplus": "\u2A2D",
        "lotimes": "\u2A34",
        "lowast": "\u2217",
        "lowbar": "_",
        "LowerLeftArrow": "\u2199",
        "LowerRightArrow": "\u2198",
        "loz": "\u25CA",
        "lozenge": "\u25CA",
        "lozf": "\u29EB",
        "lpar": "(",
        "lparlt": "\u2993",
        "lrarr": "\u21C6",
        "lrcorner": "\u231F",
        "lrhar": "\u21CB",
        "lrhard": "\u296D",
        "lrm": "\u200E",
        "lrtri": "\u22BF",
        "lsaquo": "\u2039",
        "lscr": "\uD835\uDCC1",
        "Lscr": "\u2112",
        "lsh": "\u21B0",
        "Lsh": "\u21B0",
        "lsim": "\u2272",
        "lsime": "\u2A8D",
        "lsimg": "\u2A8F",
        "lsqb": "[",
        "lsquo": "\u2018",
        "lsquor": "\u201A",
        "Lstrok": "\u0141",
        "lstrok": "\u0142",
        "ltcc": "\u2AA6",
        "ltcir": "\u2A79",
        "lt": "<",
        "LT": "<",
        "Lt": "\u226A",
        "ltdot": "\u22D6",
        "lthree": "\u22CB",
        "ltimes": "\u22C9",
        "ltlarr": "\u2976",
        "ltquest": "\u2A7B",
        "ltri": "\u25C3",
        "ltrie": "\u22B4",
        "ltrif": "\u25C2",
        "ltrPar": "\u2996",
        "lurdshar": "\u294A",
        "luruhar": "\u2966",
        "lvertneqq": "\u2268\uFE00",
        "lvnE": "\u2268\uFE00",
        "macr": "\u00AF",
        "male": "\u2642",
        "malt": "\u2720",
        "maltese": "\u2720",
        "Map": "\u2905",
        "map": "\u21A6",
        "mapsto": "\u21A6",
        "mapstodown": "\u21A7",
        "mapstoleft": "\u21A4",
        "mapstoup": "\u21A5",
        "marker": "\u25AE",
        "mcomma": "\u2A29",
        "Mcy": "\u041C",
        "mcy": "\u043C",
        "mdash": "\u2014",
        "mDDot": "\u223A",
        "measuredangle": "\u2221",
        "MediumSpace": "\u205F",
        "Mellintrf": "\u2133",
        "Mfr": "\uD835\uDD10",
        "mfr": "\uD835\uDD2A",
        "mho": "\u2127",
        "micro": "\u00B5",
        "midast": "*",
        "midcir": "\u2AF0",
        "mid": "\u2223",
        "middot": "\u00B7",
        "minusb": "\u229F",
        "minus": "\u2212",
        "minusd": "\u2238",
        "minusdu": "\u2A2A",
        "MinusPlus": "\u2213",
        "mlcp": "\u2ADB",
        "mldr": "\u2026",
        "mnplus": "\u2213",
        "models": "\u22A7",
        "Mopf": "\uD835\uDD44",
        "mopf": "\uD835\uDD5E",
        "mp": "\u2213",
        "mscr": "\uD835\uDCC2",
        "Mscr": "\u2133",
        "mstpos": "\u223E",
        "Mu": "\u039C",
        "mu": "\u03BC",
        "multimap": "\u22B8",
        "mumap": "\u22B8",
        "nabla": "\u2207",
        "Nacute": "\u0143",
        "nacute": "\u0144",
        "nang": "\u2220\u20D2",
        "nap": "\u2249",
        "napE": "\u2A70\u0338",
        "napid": "\u224B\u0338",
        "napos": "\u0149",
        "napprox": "\u2249",
        "natural": "\u266E",
        "naturals": "\u2115",
        "natur": "\u266E",
        "nbsp": "\u00A0",
        "nbump": "\u224E\u0338",
        "nbumpe": "\u224F\u0338",
        "ncap": "\u2A43",
        "Ncaron": "\u0147",
        "ncaron": "\u0148",
        "Ncedil": "\u0145",
        "ncedil": "\u0146",
        "ncong": "\u2247",
        "ncongdot": "\u2A6D\u0338",
        "ncup": "\u2A42",
        "Ncy": "\u041D",
        "ncy": "\u043D",
        "ndash": "\u2013",
        "nearhk": "\u2924",
        "nearr": "\u2197",
        "neArr": "\u21D7",
        "nearrow": "\u2197",
        "ne": "\u2260",
        "nedot": "\u2250\u0338",
        "NegativeMediumSpace": "\u200B",
        "NegativeThickSpace": "\u200B",
        "NegativeThinSpace": "\u200B",
        "NegativeVeryThinSpace": "\u200B",
        "nequiv": "\u2262",
        "nesear": "\u2928",
        "nesim": "\u2242\u0338",
        "NestedGreaterGreater": "\u226B",
        "NestedLessLess": "\u226A",
        "NewLine": "\n",
        "nexist": "\u2204",
        "nexists": "\u2204",
        "Nfr": "\uD835\uDD11",
        "nfr": "\uD835\uDD2B",
        "ngE": "\u2267\u0338",
        "nge": "\u2271",
        "ngeq": "\u2271",
        "ngeqq": "\u2267\u0338",
        "ngeqslant": "\u2A7E\u0338",
        "nges": "\u2A7E\u0338",
        "nGg": "\u22D9\u0338",
        "ngsim": "\u2275",
        "nGt": "\u226B\u20D2",
        "ngt": "\u226F",
        "ngtr": "\u226F",
        "nGtv": "\u226B\u0338",
        "nharr": "\u21AE",
        "nhArr": "\u21CE",
        "nhpar": "\u2AF2",
        "ni": "\u220B",
        "nis": "\u22FC",
        "nisd": "\u22FA",
        "niv": "\u220B",
        "NJcy": "\u040A",
        "njcy": "\u045A",
        "nlarr": "\u219A",
        "nlArr": "\u21CD",
        "nldr": "\u2025",
        "nlE": "\u2266\u0338",
        "nle": "\u2270",
        "nleftarrow": "\u219A",
        "nLeftarrow": "\u21CD",
        "nleftrightarrow": "\u21AE",
        "nLeftrightarrow": "\u21CE",
        "nleq": "\u2270",
        "nleqq": "\u2266\u0338",
        "nleqslant": "\u2A7D\u0338",
        "nles": "\u2A7D\u0338",
        "nless": "\u226E",
        "nLl": "\u22D8\u0338",
        "nlsim": "\u2274",
        "nLt": "\u226A\u20D2",
        "nlt": "\u226E",
        "nltri": "\u22EA",
        "nltrie": "\u22EC",
        "nLtv": "\u226A\u0338",
        "nmid": "\u2224",
        "NoBreak": "\u2060",
        "NonBreakingSpace": "\u00A0",
        "nopf": "\uD835\uDD5F",
        "Nopf": "\u2115",
        "Not": "\u2AEC",
        "not": "\u00AC",
        "NotCongruent": "\u2262",
        "NotCupCap": "\u226D",
        "NotDoubleVerticalBar": "\u2226",
        "NotElement": "\u2209",
        "NotEqual": "\u2260",
        "NotEqualTilde": "\u2242\u0338",
        "NotExists": "\u2204",
        "NotGreater": "\u226F",
        "NotGreaterEqual": "\u2271",
        "NotGreaterFullEqual": "\u2267\u0338",
        "NotGreaterGreater": "\u226B\u0338",
        "NotGreaterLess": "\u2279",
        "NotGreaterSlantEqual": "\u2A7E\u0338",
        "NotGreaterTilde": "\u2275",
        "NotHumpDownHump": "\u224E\u0338",
        "NotHumpEqual": "\u224F\u0338",
        "notin": "\u2209",
        "notindot": "\u22F5\u0338",
        "notinE": "\u22F9\u0338",
        "notinva": "\u2209",
        "notinvb": "\u22F7",
        "notinvc": "\u22F6",
        "NotLeftTriangleBar": "\u29CF\u0338",
        "NotLeftTriangle": "\u22EA",
        "NotLeftTriangleEqual": "\u22EC",
        "NotLess": "\u226E",
        "NotLessEqual": "\u2270",
        "NotLessGreater": "\u2278",
        "NotLessLess": "\u226A\u0338",
        "NotLessSlantEqual": "\u2A7D\u0338",
        "NotLessTilde": "\u2274",
        "NotNestedGreaterGreater": "\u2AA2\u0338",
        "NotNestedLessLess": "\u2AA1\u0338",
        "notni": "\u220C",
        "notniva": "\u220C",
        "notnivb": "\u22FE",
        "notnivc": "\u22FD",
        "NotPrecedes": "\u2280",
        "NotPrecedesEqual": "\u2AAF\u0338",
        "NotPrecedesSlantEqual": "\u22E0",
        "NotReverseElement": "\u220C",
        "NotRightTriangleBar": "\u29D0\u0338",
        "NotRightTriangle": "\u22EB",
        "NotRightTriangleEqual": "\u22ED",
        "NotSquareSubset": "\u228F\u0338",
        "NotSquareSubsetEqual": "\u22E2",
        "NotSquareSuperset": "\u2290\u0338",
        "NotSquareSupersetEqual": "\u22E3",
        "NotSubset": "\u2282\u20D2",
        "NotSubsetEqual": "\u2288",
        "NotSucceeds": "\u2281",
        "NotSucceedsEqual": "\u2AB0\u0338",
        "NotSucceedsSlantEqual": "\u22E1",
        "NotSucceedsTilde": "\u227F\u0338",
        "NotSuperset": "\u2283\u20D2",
        "NotSupersetEqual": "\u2289",
        "NotTilde": "\u2241",
        "NotTildeEqual": "\u2244",
        "NotTildeFullEqual": "\u2247",
        "NotTildeTilde": "\u2249",
        "NotVerticalBar": "\u2224",
        "nparallel": "\u2226",
        "npar": "\u2226",
        "nparsl": "\u2AFD\u20E5",
        "npart": "\u2202\u0338",
        "npolint": "\u2A14",
        "npr": "\u2280",
        "nprcue": "\u22E0",
        "nprec": "\u2280",
        "npreceq": "\u2AAF\u0338",
        "npre": "\u2AAF\u0338",
        "nrarrc": "\u2933\u0338",
        "nrarr": "\u219B",
        "nrArr": "\u21CF",
        "nrarrw": "\u219D\u0338",
        "nrightarrow": "\u219B",
        "nRightarrow": "\u21CF",
        "nrtri": "\u22EB",
        "nrtrie": "\u22ED",
        "nsc": "\u2281",
        "nsccue": "\u22E1",
        "nsce": "\u2AB0\u0338",
        "Nscr": "\uD835\uDCA9",
        "nscr": "\uD835\uDCC3",
        "nshortmid": "\u2224",
        "nshortparallel": "\u2226",
        "nsim": "\u2241",
        "nsime": "\u2244",
        "nsimeq": "\u2244",
        "nsmid": "\u2224",
        "nspar": "\u2226",
        "nsqsube": "\u22E2",
        "nsqsupe": "\u22E3",
        "nsub": "\u2284",
        "nsubE": "\u2AC5\u0338",
        "nsube": "\u2288",
        "nsubset": "\u2282\u20D2",
        "nsubseteq": "\u2288",
        "nsubseteqq": "\u2AC5\u0338",
        "nsucc": "\u2281",
        "nsucceq": "\u2AB0\u0338",
        "nsup": "\u2285",
        "nsupE": "\u2AC6\u0338",
        "nsupe": "\u2289",
        "nsupset": "\u2283\u20D2",
        "nsupseteq": "\u2289",
        "nsupseteqq": "\u2AC6\u0338",
        "ntgl": "\u2279",
        "Ntilde": "\u00D1",
        "ntilde": "\u00F1",
        "ntlg": "\u2278",
        "ntriangleleft": "\u22EA",
        "ntrianglelefteq": "\u22EC",
        "ntriangleright": "\u22EB",
        "ntrianglerighteq": "\u22ED",
        "Nu": "\u039D",
        "nu": "\u03BD",
        "num": "#",
        "numero": "\u2116",
        "numsp": "\u2007",
        "nvap": "\u224D\u20D2",
        "nvdash": "\u22AC",
        "nvDash": "\u22AD",
        "nVdash": "\u22AE",
        "nVDash": "\u22AF",
        "nvge": "\u2265\u20D2",
        "nvgt": ">\u20D2",
        "nvHarr": "\u2904",
        "nvinfin": "\u29DE",
        "nvlArr": "\u2902",
        "nvle": "\u2264\u20D2",
        "nvlt": "<\u20D2",
        "nvltrie": "\u22B4\u20D2",
        "nvrArr": "\u2903",
        "nvrtrie": "\u22B5\u20D2",
        "nvsim": "\u223C\u20D2",
        "nwarhk": "\u2923",
        "nwarr": "\u2196",
        "nwArr": "\u21D6",
        "nwarrow": "\u2196",
        "nwnear": "\u2927",
        "Oacute": "\u00D3",
        "oacute": "\u00F3",
        "oast": "\u229B",
        "Ocirc": "\u00D4",
        "ocirc": "\u00F4",
        "ocir": "\u229A",
        "Ocy": "\u041E",
        "ocy": "\u043E",
        "odash": "\u229D",
        "Odblac": "\u0150",
        "odblac": "\u0151",
        "odiv": "\u2A38",
        "odot": "\u2299",
        "odsold": "\u29BC",
        "OElig": "\u0152",
        "oelig": "\u0153",
        "ofcir": "\u29BF",
        "Ofr": "\uD835\uDD12",
        "ofr": "\uD835\uDD2C",
        "ogon": "\u02DB",
        "Ograve": "\u00D2",
        "ograve": "\u00F2",
        "ogt": "\u29C1",
        "ohbar": "\u29B5",
        "ohm": "\u03A9",
        "oint": "\u222E",
        "olarr": "\u21BA",
        "olcir": "\u29BE",
        "olcross": "\u29BB",
        "oline": "\u203E",
        "olt": "\u29C0",
        "Omacr": "\u014C",
        "omacr": "\u014D",
        "Omega": "\u03A9",
        "omega": "\u03C9",
        "Omicron": "\u039F",
        "omicron": "\u03BF",
        "omid": "\u29B6",
        "ominus": "\u2296",
        "Oopf": "\uD835\uDD46",
        "oopf": "\uD835\uDD60",
        "opar": "\u29B7",
        "OpenCurlyDoubleQuote": "\u201C",
        "OpenCurlyQuote": "\u2018",
        "operp": "\u29B9",
        "oplus": "\u2295",
        "orarr": "\u21BB",
        "Or": "\u2A54",
        "or": "\u2228",
        "ord": "\u2A5D",
        "order": "\u2134",
        "orderof": "\u2134",
        "ordf": "\u00AA",
        "ordm": "\u00BA",
        "origof": "\u22B6",
        "oror": "\u2A56",
        "orslope": "\u2A57",
        "orv": "\u2A5B",
        "oS": "\u24C8",
        "Oscr": "\uD835\uDCAA",
        "oscr": "\u2134",
        "Oslash": "\u00D8",
        "oslash": "\u00F8",
        "osol": "\u2298",
        "Otilde": "\u00D5",
        "otilde": "\u00F5",
        "otimesas": "\u2A36",
        "Otimes": "\u2A37",
        "otimes": "\u2297",
        "Ouml": "\u00D6",
        "ouml": "\u00F6",
        "ovbar": "\u233D",
        "OverBar": "\u203E",
        "OverBrace": "\u23DE",
        "OverBracket": "\u23B4",
        "OverParenthesis": "\u23DC",
        "para": "\u00B6",
        "parallel": "\u2225",
        "par": "\u2225",
        "parsim": "\u2AF3",
        "parsl": "\u2AFD",
        "part": "\u2202",
        "PartialD": "\u2202",
        "Pcy": "\u041F",
        "pcy": "\u043F",
        "percnt": "%",
        "period": ".",
        "permil": "\u2030",
        "perp": "\u22A5",
        "pertenk": "\u2031",
        "Pfr": "\uD835\uDD13",
        "pfr": "\uD835\uDD2D",
        "Phi": "\u03A6",
        "phi": "\u03C6",
        "phiv": "\u03D5",
        "phmmat": "\u2133",
        "phone": "\u260E",
        "Pi": "\u03A0",
        "pi": "\u03C0",
        "pitchfork": "\u22D4",
        "piv": "\u03D6",
        "planck": "\u210F",
        "planckh": "\u210E",
        "plankv": "\u210F",
        "plusacir": "\u2A23",
        "plusb": "\u229E",
        "pluscir": "\u2A22",
        "plus": "+",
        "plusdo": "\u2214",
        "plusdu": "\u2A25",
        "pluse": "\u2A72",
        "PlusMinus": "\u00B1",
        "plusmn": "\u00B1",
        "plussim": "\u2A26",
        "plustwo": "\u2A27",
        "pm": "\u00B1",
        "Poincareplane": "\u210C",
        "pointint": "\u2A15",
        "popf": "\uD835\uDD61",
        "Popf": "\u2119",
        "pound": "\u00A3",
        "prap": "\u2AB7",
        "Pr": "\u2ABB",
        "pr": "\u227A",
        "prcue": "\u227C",
        "precapprox": "\u2AB7",
        "prec": "\u227A",
        "preccurlyeq": "\u227C",
        "Precedes": "\u227A",
        "PrecedesEqual": "\u2AAF",
        "PrecedesSlantEqual": "\u227C",
        "PrecedesTilde": "\u227E",
        "preceq": "\u2AAF",
        "precnapprox": "\u2AB9",
        "precneqq": "\u2AB5",
        "precnsim": "\u22E8",
        "pre": "\u2AAF",
        "prE": "\u2AB3",
        "precsim": "\u227E",
        "prime": "\u2032",
        "Prime": "\u2033",
        "primes": "\u2119",
        "prnap": "\u2AB9",
        "prnE": "\u2AB5",
        "prnsim": "\u22E8",
        "prod": "\u220F",
        "Product": "\u220F",
        "profalar": "\u232E",
        "profline": "\u2312",
        "profsurf": "\u2313",
        "prop": "\u221D",
        "Proportional": "\u221D",
        "Proportion": "\u2237",
        "propto": "\u221D",
        "prsim": "\u227E",
        "prurel": "\u22B0",
        "Pscr": "\uD835\uDCAB",
        "pscr": "\uD835\uDCC5",
        "Psi": "\u03A8",
        "psi": "\u03C8",
        "puncsp": "\u2008",
        "Qfr": "\uD835\uDD14",
        "qfr": "\uD835\uDD2E",
        "qint": "\u2A0C",
        "qopf": "\uD835\uDD62",
        "Qopf": "\u211A",
        "qprime": "\u2057",
        "Qscr": "\uD835\uDCAC",
        "qscr": "\uD835\uDCC6",
        "quaternions": "\u210D",
        "quatint": "\u2A16",
        "quest": "?",
        "questeq": "\u225F",
        "quot": "\"",
        "QUOT": "\"",
        "rAarr": "\u21DB",
        "race": "\u223D\u0331",
        "Racute": "\u0154",
        "racute": "\u0155",
        "radic": "\u221A",
        "raemptyv": "\u29B3",
        "rang": "\u27E9",
        "Rang": "\u27EB",
        "rangd": "\u2992",
        "range": "\u29A5",
        "rangle": "\u27E9",
        "raquo": "\u00BB",
        "rarrap": "\u2975",
        "rarrb": "\u21E5",
        "rarrbfs": "\u2920",
        "rarrc": "\u2933",
        "rarr": "\u2192",
        "Rarr": "\u21A0",
        "rArr": "\u21D2",
        "rarrfs": "\u291E",
        "rarrhk": "\u21AA",
        "rarrlp": "\u21AC",
        "rarrpl": "\u2945",
        "rarrsim": "\u2974",
        "Rarrtl": "\u2916",
        "rarrtl": "\u21A3",
        "rarrw": "\u219D",
        "ratail": "\u291A",
        "rAtail": "\u291C",
        "ratio": "\u2236",
        "rationals": "\u211A",
        "rbarr": "\u290D",
        "rBarr": "\u290F",
        "RBarr": "\u2910",
        "rbbrk": "\u2773",
        "rbrace": "}",
        "rbrack": "]",
        "rbrke": "\u298C",
        "rbrksld": "\u298E",
        "rbrkslu": "\u2990",
        "Rcaron": "\u0158",
        "rcaron": "\u0159",
        "Rcedil": "\u0156",
        "rcedil": "\u0157",
        "rceil": "\u2309",
        "rcub": "}",
        "Rcy": "\u0420",
        "rcy": "\u0440",
        "rdca": "\u2937",
        "rdldhar": "\u2969",
        "rdquo": "\u201D",
        "rdquor": "\u201D",
        "rdsh": "\u21B3",
        "real": "\u211C",
        "realine": "\u211B",
        "realpart": "\u211C",
        "reals": "\u211D",
        "Re": "\u211C",
        "rect": "\u25AD",
        "reg": "\u00AE",
        "REG": "\u00AE",
        "ReverseElement": "\u220B",
        "ReverseEquilibrium": "\u21CB",
        "ReverseUpEquilibrium": "\u296F",
        "rfisht": "\u297D",
        "rfloor": "\u230B",
        "rfr": "\uD835\uDD2F",
        "Rfr": "\u211C",
        "rHar": "\u2964",
        "rhard": "\u21C1",
        "rharu": "\u21C0",
        "rharul": "\u296C",
        "Rho": "\u03A1",
        "rho": "\u03C1",
        "rhov": "\u03F1",
        "RightAngleBracket": "\u27E9",
        "RightArrowBar": "\u21E5",
        "rightarrow": "\u2192",
        "RightArrow": "\u2192",
        "Rightarrow": "\u21D2",
        "RightArrowLeftArrow": "\u21C4",
        "rightarrowtail": "\u21A3",
        "RightCeiling": "\u2309",
        "RightDoubleBracket": "\u27E7",
        "RightDownTeeVector": "\u295D",
        "RightDownVectorBar": "\u2955",
        "RightDownVector": "\u21C2",
        "RightFloor": "\u230B",
        "rightharpoondown": "\u21C1",
        "rightharpoonup": "\u21C0",
        "rightleftarrows": "\u21C4",
        "rightleftharpoons": "\u21CC",
        "rightrightarrows": "\u21C9",
        "rightsquigarrow": "\u219D",
        "RightTeeArrow": "\u21A6",
        "RightTee": "\u22A2",
        "RightTeeVector": "\u295B",
        "rightthreetimes": "\u22CC",
        "RightTriangleBar": "\u29D0",
        "RightTriangle": "\u22B3",
        "RightTriangleEqual": "\u22B5",
        "RightUpDownVector": "\u294F",
        "RightUpTeeVector": "\u295C",
        "RightUpVectorBar": "\u2954",
        "RightUpVector": "\u21BE",
        "RightVectorBar": "\u2953",
        "RightVector": "\u21C0",
        "ring": "\u02DA",
        "risingdotseq": "\u2253",
        "rlarr": "\u21C4",
        "rlhar": "\u21CC",
        "rlm": "\u200F",
        "rmoustache": "\u23B1",
        "rmoust": "\u23B1",
        "rnmid": "\u2AEE",
        "roang": "\u27ED",
        "roarr": "\u21FE",
        "robrk": "\u27E7",
        "ropar": "\u2986",
        "ropf": "\uD835\uDD63",
        "Ropf": "\u211D",
        "roplus": "\u2A2E",
        "rotimes": "\u2A35",
        "RoundImplies": "\u2970",
        "rpar": ")",
        "rpargt": "\u2994",
        "rppolint": "\u2A12",
        "rrarr": "\u21C9",
        "Rrightarrow": "\u21DB",
        "rsaquo": "\u203A",
        "rscr": "\uD835\uDCC7",
        "Rscr": "\u211B",
        "rsh": "\u21B1",
        "Rsh": "\u21B1",
        "rsqb": "]",
        "rsquo": "\u2019",
        "rsquor": "\u2019",
        "rthree": "\u22CC",
        "rtimes": "\u22CA",
        "rtri": "\u25B9",
        "rtrie": "\u22B5",
        "rtrif": "\u25B8",
        "rtriltri": "\u29CE",
        "RuleDelayed": "\u29F4",
        "ruluhar": "\u2968",
        "rx": "\u211E",
        "Sacute": "\u015A",
        "sacute": "\u015B",
        "sbquo": "\u201A",
        "scap": "\u2AB8",
        "Scaron": "\u0160",
        "scaron": "\u0161",
        "Sc": "\u2ABC",
        "sc": "\u227B",
        "sccue": "\u227D",
        "sce": "\u2AB0",
        "scE": "\u2AB4",
        "Scedil": "\u015E",
        "scedil": "\u015F",
        "Scirc": "\u015C",
        "scirc": "\u015D",
        "scnap": "\u2ABA",
        "scnE": "\u2AB6",
        "scnsim": "\u22E9",
        "scpolint": "\u2A13",
        "scsim": "\u227F",
        "Scy": "\u0421",
        "scy": "\u0441",
        "sdotb": "\u22A1",
        "sdot": "\u22C5",
        "sdote": "\u2A66",
        "searhk": "\u2925",
        "searr": "\u2198",
        "seArr": "\u21D8",
        "searrow": "\u2198",
        "sect": "\u00A7",
        "semi": ";",
        "seswar": "\u2929",
        "setminus": "\u2216",
        "setmn": "\u2216",
        "sext": "\u2736",
        "Sfr": "\uD835\uDD16",
        "sfr": "\uD835\uDD30",
        "sfrown": "\u2322",
        "sharp": "\u266F",
        "SHCHcy": "\u0429",
        "shchcy": "\u0449",
        "SHcy": "\u0428",
        "shcy": "\u0448",
        "ShortDownArrow": "\u2193",
        "ShortLeftArrow": "\u2190",
        "shortmid": "\u2223",
        "shortparallel": "\u2225",
        "ShortRightArrow": "\u2192",
        "ShortUpArrow": "\u2191",
        "shy": "\u00AD",
        "Sigma": "\u03A3",
        "sigma": "\u03C3",
        "sigmaf": "\u03C2",
        "sigmav": "\u03C2",
        "sim": "\u223C",
        "simdot": "\u2A6A",
        "sime": "\u2243",
        "simeq": "\u2243",
        "simg": "\u2A9E",
        "simgE": "\u2AA0",
        "siml": "\u2A9D",
        "simlE": "\u2A9F",
        "simne": "\u2246",
        "simplus": "\u2A24",
        "simrarr": "\u2972",
        "slarr": "\u2190",
        "SmallCircle": "\u2218",
        "smallsetminus": "\u2216",
        "smashp": "\u2A33",
        "smeparsl": "\u29E4",
        "smid": "\u2223",
        "smile": "\u2323",
        "smt": "\u2AAA",
        "smte": "\u2AAC",
        "smtes": "\u2AAC\uFE00",
        "SOFTcy": "\u042C",
        "softcy": "\u044C",
        "solbar": "\u233F",
        "solb": "\u29C4",
        "sol": "/",
        "Sopf": "\uD835\uDD4A",
        "sopf": "\uD835\uDD64",
        "spades": "\u2660",
        "spadesuit": "\u2660",
        "spar": "\u2225",
        "sqcap": "\u2293",
        "sqcaps": "\u2293\uFE00",
        "sqcup": "\u2294",
        "sqcups": "\u2294\uFE00",
        "Sqrt": "\u221A",
        "sqsub": "\u228F",
        "sqsube": "\u2291",
        "sqsubset": "\u228F",
        "sqsubseteq": "\u2291",
        "sqsup": "\u2290",
        "sqsupe": "\u2292",
        "sqsupset": "\u2290",
        "sqsupseteq": "\u2292",
        "square": "\u25A1",
        "Square": "\u25A1",
        "SquareIntersection": "\u2293",
        "SquareSubset": "\u228F",
        "SquareSubsetEqual": "\u2291",
        "SquareSuperset": "\u2290",
        "SquareSupersetEqual": "\u2292",
        "SquareUnion": "\u2294",
        "squarf": "\u25AA",
        "squ": "\u25A1",
        "squf": "\u25AA",
        "srarr": "\u2192",
        "Sscr": "\uD835\uDCAE",
        "sscr": "\uD835\uDCC8",
        "ssetmn": "\u2216",
        "ssmile": "\u2323",
        "sstarf": "\u22C6",
        "Star": "\u22C6",
        "star": "\u2606",
        "starf": "\u2605",
        "straightepsilon": "\u03F5",
        "straightphi": "\u03D5",
        "strns": "\u00AF",
        "sub": "\u2282",
        "Sub": "\u22D0",
        "subdot": "\u2ABD",
        "subE": "\u2AC5",
        "sube": "\u2286",
        "subedot": "\u2AC3",
        "submult": "\u2AC1",
        "subnE": "\u2ACB",
        "subne": "\u228A",
        "subplus": "\u2ABF",
        "subrarr": "\u2979",
        "subset": "\u2282",
        "Subset": "\u22D0",
        "subseteq": "\u2286",
        "subseteqq": "\u2AC5",
        "SubsetEqual": "\u2286",
        "subsetneq": "\u228A",
        "subsetneqq": "\u2ACB",
        "subsim": "\u2AC7",
        "subsub": "\u2AD5",
        "subsup": "\u2AD3",
        "succapprox": "\u2AB8",
        "succ": "\u227B",
        "succcurlyeq": "\u227D",
        "Succeeds": "\u227B",
        "SucceedsEqual": "\u2AB0",
        "SucceedsSlantEqual": "\u227D",
        "SucceedsTilde": "\u227F",
        "succeq": "\u2AB0",
        "succnapprox": "\u2ABA",
        "succneqq": "\u2AB6",
        "succnsim": "\u22E9",
        "succsim": "\u227F",
        "SuchThat": "\u220B",
        "sum": "\u2211",
        "Sum": "\u2211",
        "sung": "\u266A",
        "sup1": "\u00B9",
        "sup2": "\u00B2",
        "sup3": "\u00B3",
        "sup": "\u2283",
        "Sup": "\u22D1",
        "supdot": "\u2ABE",
        "supdsub": "\u2AD8",
        "supE": "\u2AC6",
        "supe": "\u2287",
        "supedot": "\u2AC4",
        "Superset": "\u2283",
        "SupersetEqual": "\u2287",
        "suphsol": "\u27C9",
        "suphsub": "\u2AD7",
        "suplarr": "\u297B",
        "supmult": "\u2AC2",
        "supnE": "\u2ACC",
        "supne": "\u228B",
        "supplus": "\u2AC0",
        "supset": "\u2283",
        "Supset": "\u22D1",
        "supseteq": "\u2287",
        "supseteqq": "\u2AC6",
        "supsetneq": "\u228B",
        "supsetneqq": "\u2ACC",
        "supsim": "\u2AC8",
        "supsub": "\u2AD4",
        "supsup": "\u2AD6",
        "swarhk": "\u2926",
        "swarr": "\u2199",
        "swArr": "\u21D9",
        "swarrow": "\u2199",
        "swnwar": "\u292A",
        "szlig": "\u00DF",
        "Tab": "\t",
        "target": "\u2316",
        "Tau": "\u03A4",
        "tau": "\u03C4",
        "tbrk": "\u23B4",
        "Tcaron": "\u0164",
        "tcaron": "\u0165",
        "Tcedil": "\u0162",
        "tcedil": "\u0163",
        "Tcy": "\u0422",
        "tcy": "\u0442",
        "tdot": "\u20DB",
        "telrec": "\u2315",
        "Tfr": "\uD835\uDD17",
        "tfr": "\uD835\uDD31",
        "there4": "\u2234",
        "therefore": "\u2234",
        "Therefore": "\u2234",
        "Theta": "\u0398",
        "theta": "\u03B8",
        "thetasym": "\u03D1",
        "thetav": "\u03D1",
        "thickapprox": "\u2248",
        "thicksim": "\u223C",
        "ThickSpace": "\u205F\u200A",
        "ThinSpace": "\u2009",
        "thinsp": "\u2009",
        "thkap": "\u2248",
        "thksim": "\u223C",
        "THORN": "\u00DE",
        "thorn": "\u00FE",
        "tilde": "\u02DC",
        "Tilde": "\u223C",
        "TildeEqual": "\u2243",
        "TildeFullEqual": "\u2245",
        "TildeTilde": "\u2248",
        "timesbar": "\u2A31",
        "timesb": "\u22A0",
        "times": "\u00D7",
        "timesd": "\u2A30",
        "tint": "\u222D",
        "toea": "\u2928",
        "topbot": "\u2336",
        "topcir": "\u2AF1",
        "top": "\u22A4",
        "Topf": "\uD835\uDD4B",
        "topf": "\uD835\uDD65",
        "topfork": "\u2ADA",
        "tosa": "\u2929",
        "tprime": "\u2034",
        "trade": "\u2122",
        "TRADE": "\u2122",
        "triangle": "\u25B5",
        "triangledown": "\u25BF",
        "triangleleft": "\u25C3",
        "trianglelefteq": "\u22B4",
        "triangleq": "\u225C",
        "triangleright": "\u25B9",
        "trianglerighteq": "\u22B5",
        "tridot": "\u25EC",
        "trie": "\u225C",
        "triminus": "\u2A3A",
        "TripleDot": "\u20DB",
        "triplus": "\u2A39",
        "trisb": "\u29CD",
        "tritime": "\u2A3B",
        "trpezium": "\u23E2",
        "Tscr": "\uD835\uDCAF",
        "tscr": "\uD835\uDCC9",
        "TScy": "\u0426",
        "tscy": "\u0446",
        "TSHcy": "\u040B",
        "tshcy": "\u045B",
        "Tstrok": "\u0166",
        "tstrok": "\u0167",
        "twixt": "\u226C",
        "twoheadleftarrow": "\u219E",
        "twoheadrightarrow": "\u21A0",
        "Uacute": "\u00DA",
        "uacute": "\u00FA",
        "uarr": "\u2191",
        "Uarr": "\u219F",
        "uArr": "\u21D1",
        "Uarrocir": "\u2949",
        "Ubrcy": "\u040E",
        "ubrcy": "\u045E",
        "Ubreve": "\u016C",
        "ubreve": "\u016D",
        "Ucirc": "\u00DB",
        "ucirc": "\u00FB",
        "Ucy": "\u0423",
        "ucy": "\u0443",
        "udarr": "\u21C5",
        "Udblac": "\u0170",
        "udblac": "\u0171",
        "udhar": "\u296E",
        "ufisht": "\u297E",
        "Ufr": "\uD835\uDD18",
        "ufr": "\uD835\uDD32",
        "Ugrave": "\u00D9",
        "ugrave": "\u00F9",
        "uHar": "\u2963",
        "uharl": "\u21BF",
        "uharr": "\u21BE",
        "uhblk": "\u2580",
        "ulcorn": "\u231C",
        "ulcorner": "\u231C",
        "ulcrop": "\u230F",
        "ultri": "\u25F8",
        "Umacr": "\u016A",
        "umacr": "\u016B",
        "uml": "\u00A8",
        "UnderBar": "_",
        "UnderBrace": "\u23DF",
        "UnderBracket": "\u23B5",
        "UnderParenthesis": "\u23DD",
        "Union": "\u22C3",
        "UnionPlus": "\u228E",
        "Uogon": "\u0172",
        "uogon": "\u0173",
        "Uopf": "\uD835\uDD4C",
        "uopf": "\uD835\uDD66",
        "UpArrowBar": "\u2912",
        "uparrow": "\u2191",
        "UpArrow": "\u2191",
        "Uparrow": "\u21D1",
        "UpArrowDownArrow": "\u21C5",
        "updownarrow": "\u2195",
        "UpDownArrow": "\u2195",
        "Updownarrow": "\u21D5",
        "UpEquilibrium": "\u296E",
        "upharpoonleft": "\u21BF",
        "upharpoonright": "\u21BE",
        "uplus": "\u228E",
        "UpperLeftArrow": "\u2196",
        "UpperRightArrow": "\u2197",
        "upsi": "\u03C5",
        "Upsi": "\u03D2",
        "upsih": "\u03D2",
        "Upsilon": "\u03A5",
        "upsilon": "\u03C5",
        "UpTeeArrow": "\u21A5",
        "UpTee": "\u22A5",
        "upuparrows": "\u21C8",
        "urcorn": "\u231D",
        "urcorner": "\u231D",
        "urcrop": "\u230E",
        "Uring": "\u016E",
        "uring": "\u016F",
        "urtri": "\u25F9",
        "Uscr": "\uD835\uDCB0",
        "uscr": "\uD835\uDCCA",
        "utdot": "\u22F0",
        "Utilde": "\u0168",
        "utilde": "\u0169",
        "utri": "\u25B5",
        "utrif": "\u25B4",
        "uuarr": "\u21C8",
        "Uuml": "\u00DC",
        "uuml": "\u00FC",
        "uwangle": "\u29A7",
        "vangrt": "\u299C",
        "varepsilon": "\u03F5",
        "varkappa": "\u03F0",
        "varnothing": "\u2205",
        "varphi": "\u03D5",
        "varpi": "\u03D6",
        "varpropto": "\u221D",
        "varr": "\u2195",
        "vArr": "\u21D5",
        "varrho": "\u03F1",
        "varsigma": "\u03C2",
        "varsubsetneq": "\u228A\uFE00",
        "varsubsetneqq": "\u2ACB\uFE00",
        "varsupsetneq": "\u228B\uFE00",
        "varsupsetneqq": "\u2ACC\uFE00",
        "vartheta": "\u03D1",
        "vartriangleleft": "\u22B2",
        "vartriangleright": "\u22B3",
        "vBar": "\u2AE8",
        "Vbar": "\u2AEB",
        "vBarv": "\u2AE9",
        "Vcy": "\u0412",
        "vcy": "\u0432",
        "vdash": "\u22A2",
        "vDash": "\u22A8",
        "Vdash": "\u22A9",
        "VDash": "\u22AB",
        "Vdashl": "\u2AE6",
        "veebar": "\u22BB",
        "vee": "\u2228",
        "Vee": "\u22C1",
        "veeeq": "\u225A",
        "vellip": "\u22EE",
        "verbar": "|",
        "Verbar": "\u2016",
        "vert": "|",
        "Vert": "\u2016",
        "VerticalBar": "\u2223",
        "VerticalLine": "|",
        "VerticalSeparator": "\u2758",
        "VerticalTilde": "\u2240",
        "VeryThinSpace": "\u200A",
        "Vfr": "\uD835\uDD19",
        "vfr": "\uD835\uDD33",
        "vltri": "\u22B2",
        "vnsub": "\u2282\u20D2",
        "vnsup": "\u2283\u20D2",
        "Vopf": "\uD835\uDD4D",
        "vopf": "\uD835\uDD67",
        "vprop": "\u221D",
        "vrtri": "\u22B3",
        "Vscr": "\uD835\uDCB1",
        "vscr": "\uD835\uDCCB",
        "vsubnE": "\u2ACB\uFE00",
        "vsubne": "\u228A\uFE00",
        "vsupnE": "\u2ACC\uFE00",
        "vsupne": "\u228B\uFE00",
        "Vvdash": "\u22AA",
        "vzigzag": "\u299A",
        "Wcirc": "\u0174",
        "wcirc": "\u0175",
        "wedbar": "\u2A5F",
        "wedge": "\u2227",
        "Wedge": "\u22C0",
        "wedgeq": "\u2259",
        "weierp": "\u2118",
        "Wfr": "\uD835\uDD1A",
        "wfr": "\uD835\uDD34",
        "Wopf": "\uD835\uDD4E",
        "wopf": "\uD835\uDD68",
        "wp": "\u2118",
        "wr": "\u2240",
        "wreath": "\u2240",
        "Wscr": "\uD835\uDCB2",
        "wscr": "\uD835\uDCCC",
        "xcap": "\u22C2",
        "xcirc": "\u25EF",
        "xcup": "\u22C3",
        "xdtri": "\u25BD",
        "Xfr": "\uD835\uDD1B",
        "xfr": "\uD835\uDD35",
        "xharr": "\u27F7",
        "xhArr": "\u27FA",
        "Xi": "\u039E",
        "xi": "\u03BE",
        "xlarr": "\u27F5",
        "xlArr": "\u27F8",
        "xmap": "\u27FC",
        "xnis": "\u22FB",
        "xodot": "\u2A00",
        "Xopf": "\uD835\uDD4F",
        "xopf": "\uD835\uDD69",
        "xoplus": "\u2A01",
        "xotime": "\u2A02",
        "xrarr": "\u27F6",
        "xrArr": "\u27F9",
        "Xscr": "\uD835\uDCB3",
        "xscr": "\uD835\uDCCD",
        "xsqcup": "\u2A06",
        "xuplus": "\u2A04",
        "xutri": "\u25B3",
        "xvee": "\u22C1",
        "xwedge": "\u22C0",
        "Yacute": "\u00DD",
        "yacute": "\u00FD",
        "YAcy": "\u042F",
        "yacy": "\u044F",
        "Ycirc": "\u0176",
        "ycirc": "\u0177",
        "Ycy": "\u042B",
        "ycy": "\u044B",
        "yen": "\u00A5",
        "Yfr": "\uD835\uDD1C",
        "yfr": "\uD835\uDD36",
        "YIcy": "\u0407",
        "yicy": "\u0457",
        "Yopf": "\uD835\uDD50",
        "yopf": "\uD835\uDD6A",
        "Yscr": "\uD835\uDCB4",
        "yscr": "\uD835\uDCCE",
        "YUcy": "\u042E",
        "yucy": "\u044E",
        "yuml": "\u00FF",
        "Yuml": "\u0178",
        "Zacute": "\u0179",
        "zacute": "\u017A",
        "Zcaron": "\u017D",
        "zcaron": "\u017E",
        "Zcy": "\u0417",
        "zcy": "\u0437",
        "Zdot": "\u017B",
        "zdot": "\u017C",
        "zeetrf": "\u2128",
        "ZeroWidthSpace": "\u200B",
        "Zeta": "\u0396",
        "zeta": "\u03B6",
        "zfr": "\uD835\uDD37",
        "Zfr": "\u2128",
        "ZHcy": "\u0416",
        "zhcy": "\u0436",
        "zigrarr": "\u21DD",
        "zopf": "\uD835\uDD6B",
        "Zopf": "\u2124",
        "Zscr": "\uD835\uDCB5",
        "zscr": "\uD835\uDCCF",
        "zwj": "\u200D",
        "zwnj": "\u200C"
      }
    }, {}],
    32: [function (require, module, exports) {
      module.exports = {
        "Aacute": "\u00C1",
        "aacute": "\u00E1",
        "Acirc": "\u00C2",
        "acirc": "\u00E2",
        "acute": "\u00B4",
        "AElig": "\u00C6",
        "aelig": "\u00E6",
        "Agrave": "\u00C0",
        "agrave": "\u00E0",
        "amp": "&",
        "AMP": "&",
        "Aring": "\u00C5",
        "aring": "\u00E5",
        "Atilde": "\u00C3",
        "atilde": "\u00E3",
        "Auml": "\u00C4",
        "auml": "\u00E4",
        "brvbar": "\u00A6",
        "Ccedil": "\u00C7",
        "ccedil": "\u00E7",
        "cedil": "\u00B8",
        "cent": "\u00A2",
        "copy": "\u00A9",
        "COPY": "\u00A9",
        "curren": "\u00A4",
        "deg": "\u00B0",
        "divide": "\u00F7",
        "Eacute": "\u00C9",
        "eacute": "\u00E9",
        "Ecirc": "\u00CA",
        "ecirc": "\u00EA",
        "Egrave": "\u00C8",
        "egrave": "\u00E8",
        "ETH": "\u00D0",
        "eth": "\u00F0",
        "Euml": "\u00CB",
        "euml": "\u00EB",
        "frac12": "\u00BD",
        "frac14": "\u00BC",
        "frac34": "\u00BE",
        "gt": ">",
        "GT": ">",
        "Iacute": "\u00CD",
        "iacute": "\u00ED",
        "Icirc": "\u00CE",
        "icirc": "\u00EE",
        "iexcl": "\u00A1",
        "Igrave": "\u00CC",
        "igrave": "\u00EC",
        "iquest": "\u00BF",
        "Iuml": "\u00CF",
        "iuml": "\u00EF",
        "laquo": "\u00AB",
        "lt": "<",
        "LT": "<",
        "macr": "\u00AF",
        "micro": "\u00B5",
        "middot": "\u00B7",
        "nbsp": "\u00A0",
        "not": "\u00AC",
        "Ntilde": "\u00D1",
        "ntilde": "\u00F1",
        "Oacute": "\u00D3",
        "oacute": "\u00F3",
        "Ocirc": "\u00D4",
        "ocirc": "\u00F4",
        "Ograve": "\u00D2",
        "ograve": "\u00F2",
        "ordf": "\u00AA",
        "ordm": "\u00BA",
        "Oslash": "\u00D8",
        "oslash": "\u00F8",
        "Otilde": "\u00D5",
        "otilde": "\u00F5",
        "Ouml": "\u00D6",
        "ouml": "\u00F6",
        "para": "\u00B6",
        "plusmn": "\u00B1",
        "pound": "\u00A3",
        "quot": "\"",
        "QUOT": "\"",
        "raquo": "\u00BB",
        "reg": "\u00AE",
        "REG": "\u00AE",
        "sect": "\u00A7",
        "shy": "\u00AD",
        "sup1": "\u00B9",
        "sup2": "\u00B2",
        "sup3": "\u00B3",
        "szlig": "\u00DF",
        "THORN": "\u00DE",
        "thorn": "\u00FE",
        "times": "\u00D7",
        "Uacute": "\u00DA",
        "uacute": "\u00FA",
        "Ucirc": "\u00DB",
        "ucirc": "\u00FB",
        "Ugrave": "\u00D9",
        "ugrave": "\u00F9",
        "uml": "\u00A8",
        "Uuml": "\u00DC",
        "uuml": "\u00FC",
        "Yacute": "\u00DD",
        "yacute": "\u00FD",
        "yen": "\u00A5",
        "yuml": "\u00FF"
      }
    }, {}],
    33: [function (require, module, exports) {
      module.exports = { "amp": "&", "apos": "'", "gt": ">", "lt": "<", "quot": "\"" }

    }, {}],
    34: [function (require, module, exports) {
      module.exports = CollectingHandler;

      function CollectingHandler(cbs) {
        this._cbs = cbs || {};
        this.events = [];
      }

      var EVENTS = require("./").EVENTS;
      Object.keys(EVENTS).forEach(function (name) {
        if (EVENTS[name] === 0) {
          name = "on" + name;
          CollectingHandler.prototype[name] = function () {
            this.events.push([name]);
            if (this._cbs[name]) {
              this._cbs[name]();
            }
          };
        } else if (EVENTS[name] === 1) {
          name = "on" + name;
          CollectingHandler.prototype[name] = function (a) {
            this.events.push([name, a]);
            if (this._cbs[name]) {
              this._cbs[name](a);
            }
          };
        } else if (EVENTS[name] === 2) {
          name = "on" + name;
          CollectingHandler.prototype[name] = function (a, b) {
            this.events.push([name, a, b]);
            if (this._cbs[name]) {
              this._cbs[name](a, b);
            }
          };
        } else {
          throw Error("wrong number of arguments");
        }
      });

      CollectingHandler.prototype.onreset = function () {
        this.events = [];
        if (this._cbs.onreset) {
          this._cbs.onreset();
        }
      };

      CollectingHandler.prototype.restart = function () {
        if (this._cbs.onreset) {
          this._cbs.onreset();
        }

        for (var i = 0, len = this.events.length; i < len; i++) {
          if (this._cbs[this.events[i][0]]) {
            var num = this.events[i].length;

            if (num === 1) {
              this._cbs[this.events[i][0]]();
            } else if (num === 2) {
              this._cbs[this.events[i][0]](this.events[i][1]);
            } else {
              this._cbs[this.events[i][0]](
                this.events[i][1],
                this.events[i][2]
              );
            }
          }
        }
      };

    }, { "./": 41 }],
    35: [function (require, module, exports) {
      var DomHandler = require("domhandler");
      var DomUtils = require("domutils");

//TODO: make this a streamable handler
      function FeedHandler(callback, options) {
        this.init(callback, options);
      }

      require("inherits")(FeedHandler, DomHandler);

      FeedHandler.prototype.init = DomHandler;

      function getElements(what, where) {
        return DomUtils.getElementsByTagName(what, where, true);
      }

      function getOneElement(what, where) {
        return DomUtils.getElementsByTagName(what, where, true, 1)[0];
      }

      function fetch(what, where, recurse) {
        return DomUtils.getText(
          DomUtils.getElementsByTagName(what, where, recurse, 1)
        ).trim();
      }

      function addConditionally(obj, prop, what, where, recurse) {
        var tmp = fetch(what, where, recurse);
        if (tmp) {
          obj[prop] = tmp;
        }
      }

      var isValidFeed = function (value) {
        return value === "rss" || value === "feed" || value === "rdf:RDF";
      };

      FeedHandler.prototype.onend = function () {
        var feed = {},
          feedRoot = getOneElement(isValidFeed, this.dom),
          tmp,
          childs;

        if (feedRoot) {
          if (feedRoot.name === "feed") {
            childs = feedRoot.children;

            feed.type = "atom";
            addConditionally(feed, "id", "id", childs);
            addConditionally(feed, "title", "title", childs);
            if (
              (tmp = getOneElement("link", childs)) &&
              (tmp = tmp.attribs) &&
              (tmp = tmp.href)
            )
            {
              feed.link = tmp;
            }
            addConditionally(feed, "description", "subtitle", childs);
            if ((tmp = fetch("updated", childs))) {
              feed.updated = new Date(tmp);
            }
            addConditionally(feed, "author", "email", childs, true);

            feed.items = getElements("entry", childs).map(function (item) {
              var entry = {},
                tmp;

              item = item.children;

              addConditionally(entry, "id", "id", item);
              addConditionally(entry, "title", "title", item);
              if (
                (tmp = getOneElement("link", item)) &&
                (tmp = tmp.attribs) &&
                (tmp = tmp.href)
              )
              {
                entry.link = tmp;
              }
              if ((tmp = fetch("summary", item) || fetch("content", item))) {
                entry.description = tmp;
              }
              if ((tmp = fetch("updated", item))) {
                entry.pubDate = new Date(tmp);
              }
              return entry;
            });
          } else {
            childs = getOneElement("channel", feedRoot.children).children;

            feed.type = feedRoot.name.substr(0, 3);
            feed.id = "";
            addConditionally(feed, "title", "title", childs);
            addConditionally(feed, "link", "link", childs);
            addConditionally(feed, "description", "description", childs);
            if ((tmp = fetch("lastBuildDate", childs))) {
              feed.updated = new Date(tmp);
            }
            addConditionally(feed, "author", "managingEditor", childs, true);

            feed.items = getElements("item", feedRoot.children).map(function (
              item
            )
            {
              var entry = {},
                tmp;

              item = item.children;

              addConditionally(entry, "id", "guid", item);
              addConditionally(entry, "title", "title", item);
              addConditionally(entry, "link", "link", item);
              addConditionally(entry, "description", "description", item);
              if ((tmp = fetch("pubDate", item))) {
                entry.pubDate = new Date(tmp);
              }
              return entry;
            });
          }
        }
        this.dom = feed;
        DomHandler.prototype._handleCallback.call(
          this,
          feedRoot ? null : Error("couldn't find root of feed")
        );
      };

      module.exports = FeedHandler;

    }, { "domhandler": 16, "domutils": 19, "inherits": 42 }],
    36: [function (require, module, exports) {
      var Tokenizer = require("./Tokenizer.js");

      /*
	Options:

	xmlMode: Disables the special behavior for script/style tags (false by default)
	lowerCaseAttributeNames: call .toLowerCase for each attribute name (true if xmlMode is `false`)
	lowerCaseTags: call .toLowerCase for each tag name (true if xmlMode is `false`)
*/

      /*
	Callbacks:

	oncdataend,
	oncdatastart,
	onclosetag,
	oncomment,
	oncommentend,
	onerror,
	onopentag,
	onprocessinginstruction,
	onreset,
	ontext
*/

      var formTags = {
        input: true,
        option: true,
        optgroup: true,
        select: true,
        button: true,
        datalist: true,
        textarea: true
      };

      var openImpliesClose = {
        tr: { tr: true, th: true, td: true },
        th: { th: true },
        td: { thead: true, th: true, td: true },
        body: { head: true, link: true, script: true },
        li: { li: true },
        p: { p: true },
        h1: { p: true },
        h2: { p: true },
        h3: { p: true },
        h4: { p: true },
        h5: { p: true },
        h6: { p: true },
        select: formTags,
        input: formTags,
        output: formTags,
        button: formTags,
        datalist: formTags,
        textarea: formTags,
        option: { option: true },
        optgroup: { optgroup: true }
      };

      var voidElements = {
        __proto__: null,
        area: true,
        base: true,
        basefont: true,
        br: true,
        col: true,
        command: true,
        embed: true,
        frame: true,
        hr: true,
        img: true,
        input: true,
        isindex: true,
        keygen: true,
        link: true,
        meta: true,
        param: true,
        source: true,
        track: true,
        wbr: true
      };

      var foreignContextElements = {
        __proto__: null,
        math: true,
        svg: true
      };
      var htmlIntegrationElements = {
        __proto__: null,
        mi: true,
        mo: true,
        mn: true,
        ms: true,
        mtext: true,
        "annotation-xml": true,
        foreignObject: true,
        desc: true,
        title: true
      };

      var re_nameEnd = /\s|\//;

      function Parser(cbs, options) {
        this._options = options || {};
        this._cbs = cbs || {};

        this._tagname = "";
        this._attribname = "";
        this._attribvalue = "";
        this._attribs = null;
        this._stack = [];
        this._foreignContext = [];

        this.startIndex = 0;
        this.endIndex = null;

        this._lowerCaseTagNames =
          "lowerCaseTags" in this._options
            ? !!this._options.lowerCaseTags
            : !this._options.xmlMode;
        this._lowerCaseAttributeNames =
          "lowerCaseAttributeNames" in this._options
            ? !!this._options.lowerCaseAttributeNames
            : !this._options.xmlMode;

        if (this._options.Tokenizer) {
          Tokenizer = this._options.Tokenizer;
        }
        this._tokenizer = new Tokenizer(this._options, this);

        if (this._cbs.onparserinit) {
          this._cbs.onparserinit(this);
        }
      }

      require("inherits")(Parser, _eventEmitter);

      Parser.prototype._updatePosition = function (initialOffset) {
        if (this.endIndex === null) {
          if (this._tokenizer._sectionStart <= initialOffset) {
            this.startIndex = 0;
          } else {
            this.startIndex = this._tokenizer._sectionStart - initialOffset;
          }
        } else {
          this.startIndex = this.endIndex + 1;
        }
        this.endIndex = this._tokenizer.getAbsoluteIndex();
      };

//Tokenizer event handlers
      Parser.prototype.ontext = function (data) {
        this._updatePosition(1);
        this.endIndex--;

        if (this._cbs.ontext) {
          this._cbs.ontext(data);
        }
      };

      Parser.prototype.onopentagname = function (name) {
        if (this._lowerCaseTagNames) {
          name = name.toLowerCase();
        }

        this._tagname = name;

        if (!this._options.xmlMode && name in openImpliesClose) {
          for (
            var el;
            (el = this._stack[this._stack.length - 1]) in
            openImpliesClose[name];
            this.onclosetag(el)
          ) ;
        }

        if (this._options.xmlMode || !(name in voidElements)) {
          this._stack.push(name);
          if (name in foreignContextElements) {
            this._foreignContext.push(true);
          } else if (name in htmlIntegrationElements) {
            this._foreignContext.push(false);
          }
        }

        if (this._cbs.onopentagname) {
          this._cbs.onopentagname(name);
        }
        if (this._cbs.onopentag) {
          this._attribs = {};
        }
      };

      Parser.prototype.onopentagend = function () {
        this._updatePosition(1);

        if (this._attribs) {
          if (this._cbs.onopentag) {
            this._cbs.onopentag(this._tagname, this._attribs);
          }
          this._attribs = null;
        }

        if (
          !this._options.xmlMode &&
          this._cbs.onclosetag &&
          this._tagname in voidElements
        )
        {
          this._cbs.onclosetag(this._tagname);
        }

        this._tagname = "";
      };

      Parser.prototype.onclosetag = function (name) {
        this._updatePosition(1);

        if (this._lowerCaseTagNames) {
          name = name.toLowerCase();
        }

        if (name in foreignContextElements || name in htmlIntegrationElements) {
          this._foreignContext.pop();
        }

        if (
          this._stack.length &&
          (!(name in voidElements) || this._options.xmlMode)
        )
        {
          var pos = this._stack.lastIndexOf(name);
          if (pos !== -1) {
            if (this._cbs.onclosetag) {
              pos = this._stack.length - pos;
              while (pos--) this._cbs.onclosetag(this._stack.pop());
            } else {
              this._stack.length = pos;
            }
          } else if (name === "p" && !this._options.xmlMode) {
            this.onopentagname(name);
            this._closeCurrentTag();
          }
        } else if (!this._options.xmlMode && (name === "br" || name === "p")) {
          this.onopentagname(name);
          this._closeCurrentTag();
        }
      };

      Parser.prototype.onselfclosingtag = function () {
        if (
          this._options.xmlMode ||
          this._options.recognizeSelfClosing ||
          this._foreignContext[this._foreignContext.length - 1]
        )
        {
          this._closeCurrentTag();
        } else {
          this.onopentagend();
        }
      };

      Parser.prototype._closeCurrentTag = function () {
        var name = this._tagname;

        this.onopentagend();

        //self-closing tags will be on the top of the stack
        //(cheaper check than in onclosetag)
        if (this._stack[this._stack.length - 1] === name) {
          if (this._cbs.onclosetag) {
            this._cbs.onclosetag(name);
          }
          this._stack.pop();

        }
      };

      Parser.prototype.onattribname = function (name) {
        if (this._lowerCaseAttributeNames) {
          name = name.toLowerCase();
        }
        this._attribname = name;
      };

      Parser.prototype.onattribdata = function (value) {
        this._attribvalue += value;
      };

      Parser.prototype.onattribend = function () {
        if (this._cbs.onattribute) {
          this._cbs.onattribute(this._attribname, this._attribvalue);
        }
        if (
          this._attribs &&
          !Object.prototype.hasOwnProperty.call(this._attribs, this._attribname)
        )
        {
          this._attribs[this._attribname] = this._attribvalue;
        }
        this._attribname = "";
        this._attribvalue = "";
      };

      Parser.prototype._getInstructionName = function (value) {
        var idx = value.search(re_nameEnd),
          name = idx < 0 ? value : value.substr(0, idx);

        if (this._lowerCaseTagNames) {
          name = name.toLowerCase();
        }

        return name;
      };

      Parser.prototype.ondeclaration = function (value) {
        if (this._cbs.onprocessinginstruction) {
          var name = this._getInstructionName(value);
          this._cbs.onprocessinginstruction("!" + name, "!" + value);
        }
      };

      Parser.prototype.onprocessinginstruction = function (value) {
        if (this._cbs.onprocessinginstruction) {
          var name = this._getInstructionName(value);
          this._cbs.onprocessinginstruction("?" + name, "?" + value);
        }
      };

      Parser.prototype.oncomment = function (value) {
        this._updatePosition(4);

        if (this._cbs.oncomment) {
          this._cbs.oncomment(value);
        }
        if (this._cbs.oncommentend) {
          this._cbs.oncommentend();
        }
      };

      Parser.prototype.oncdata = function (value) {
        this._updatePosition(1);

        if (this._options.xmlMode || this._options.recognizeCDATA) {
          if (this._cbs.oncdatastart) {
            this._cbs.oncdatastart();
          }
          if (this._cbs.ontext) {
            this._cbs.ontext(value);
          }
          if (this._cbs.oncdataend) {
            this._cbs.oncdataend();
          }
        } else {
          this.oncomment("[CDATA[" + value + "]]");
        }
      };

      Parser.prototype.onerror = function (err) {
        if (this._cbs.onerror) {
          this._cbs.onerror(err);
        }
      };

      Parser.prototype.onend = function () {
        if (this._cbs.onclosetag) {
          for (
            var i = this._stack.length;
            i > 0;
            this._cbs.onclosetag(this._stack[--i])
          ) ;
        }
        if (this._cbs.onend) {
          this._cbs.onend();
        }
      };

//Resets the parser to a blank state, ready to parse a new HTML document
      Parser.prototype.reset = function () {
        if (this._cbs.onreset) {
          this._cbs.onreset();
        }
        this._tokenizer.reset();

        this._tagname = "";
        this._attribname = "";
        this._attribs = null;
        this._stack = [];

        if (this._cbs.onparserinit) {
          this._cbs.onparserinit(this);
        }
      };

//Parses a complete HTML document and pushes it to the handler
      Parser.prototype.parseComplete = function (data) {
        this.reset();
        this.end(data);
      };

      Parser.prototype.write = function (chunk) {
        this._tokenizer.write(chunk);
      };

      Parser.prototype.end = function (chunk) {
        this._tokenizer.end(chunk);
      };

      Parser.prototype.pause = function () {
        this._tokenizer.pause();
      };

      Parser.prototype.resume = function () {
        this._tokenizer.resume();
      };

//alias for backwards compat
      Parser.prototype.parseChunk = Parser.prototype.write;
      Parser.prototype.done = Parser.prototype.end;

      module.exports = Parser;

    }, { "./Tokenizer.js": 39, "events": undefined, "inherits": 42 }],
    37: [function (require, module, exports) {
      module.exports = ProxyHandler;

      function ProxyHandler(cbs) {
        this._cbs = cbs || {};
      }

      var EVENTS = require("./").EVENTS;
      Object.keys(EVENTS).forEach(function (name) {
        if (EVENTS[name] === 0) {
          name = "on" + name;
          ProxyHandler.prototype[name] = function () {
            if (this._cbs[name]) {
              this._cbs[name]();
            }
          };
        } else if (EVENTS[name] === 1) {
          name = "on" + name;
          ProxyHandler.prototype[name] = function (a) {
            if (this._cbs[name]) {
              this._cbs[name](a);
            }
          };
        } else if (EVENTS[name] === 2) {
          name = "on" + name;
          ProxyHandler.prototype[name] = function (a, b) {
            if (this._cbs[name]) {
              this._cbs[name](a, b);
            }
          };
        } else {
          throw Error("wrong number of arguments");
        }
      });

    }, { "./": 41 }],
    38: [function (require, module, exports) {
      module.exports = Stream;

      var Parser = require("./WritableStream.js");

      function Stream(options) {
        Parser.call(this, new Cbs(this), options);
      }

      require("inherits")(Stream, Parser);

      Stream.prototype.readable = true;

      function Cbs(scope) {
        this.scope = scope;
      }

      var EVENTS = require("../").EVENTS;

      Object.keys(EVENTS).forEach(function (name) {
        if (EVENTS[name] === 0) {
          Cbs.prototype["on" + name] = function () {
            this.scope.emit(name);
          };
        } else if (EVENTS[name] === 1) {
          Cbs.prototype["on" + name] = function (a) {
            this.scope.emit(name, a);
          };
        } else if (EVENTS[name] === 2) {
          Cbs.prototype["on" + name] = function (a, b) {
            this.scope.emit(name, a, b);
          };
        } else {
          throw Error("wrong number of arguments!");
        }
      });

    }, { "../": 41, "./WritableStream.js": 40, "inherits": 42 }],
    39: [function (require, module, exports) {
      module.exports = Tokenizer;

      var decodeCodePoint = require("entities/lib/decode_codepoint.js");
      var entityMap = require("entities/maps/entities.json");
      var legacyMap = require("entities/maps/legacy.json");
      var xmlMap = require("entities/maps/xml.json");

      var i = 0;

      var TEXT = i++;
      var BEFORE_TAG_NAME = i++; //after <
      var IN_TAG_NAME = i++;
      var IN_SELF_CLOSING_TAG = i++;
      var BEFORE_CLOSING_TAG_NAME = i++;
      var IN_CLOSING_TAG_NAME = i++;
      var AFTER_CLOSING_TAG_NAME = i++;

//attributes
      var BEFORE_ATTRIBUTE_NAME = i++;
      var IN_ATTRIBUTE_NAME = i++;
      var AFTER_ATTRIBUTE_NAME = i++;
      var BEFORE_ATTRIBUTE_VALUE = i++;
      var IN_ATTRIBUTE_VALUE_DQ = i++; // "
      var IN_ATTRIBUTE_VALUE_SQ = i++; // '
      var IN_ATTRIBUTE_VALUE_NQ = i++;

//declarations
      var BEFORE_DECLARATION = i++; // !
      var IN_DECLARATION = i++;

//processing instructions
      var IN_PROCESSING_INSTRUCTION = i++; // ?

//comments
      var BEFORE_COMMENT = i++;
      var IN_COMMENT = i++;
      var AFTER_COMMENT_1 = i++;
      var AFTER_COMMENT_2 = i++;

//cdata
      var BEFORE_CDATA_1 = i++; // [
      var BEFORE_CDATA_2 = i++; // C
      var BEFORE_CDATA_3 = i++; // D
      var BEFORE_CDATA_4 = i++; // A
      var BEFORE_CDATA_5 = i++; // T
      var BEFORE_CDATA_6 = i++; // A
      var IN_CDATA = i++; // [
      var AFTER_CDATA_1 = i++; // ]
      var AFTER_CDATA_2 = i++; // ]

//special tags
      var BEFORE_SPECIAL = i++; //S
      var BEFORE_SPECIAL_END = i++; //S

      var BEFORE_SCRIPT_1 = i++; //C
      var BEFORE_SCRIPT_2 = i++; //R
      var BEFORE_SCRIPT_3 = i++; //I
      var BEFORE_SCRIPT_4 = i++; //P
      var BEFORE_SCRIPT_5 = i++; //T
      var AFTER_SCRIPT_1 = i++; //C
      var AFTER_SCRIPT_2 = i++; //R
      var AFTER_SCRIPT_3 = i++; //I
      var AFTER_SCRIPT_4 = i++; //P
      var AFTER_SCRIPT_5 = i++; //T

      var BEFORE_STYLE_1 = i++; //T
      var BEFORE_STYLE_2 = i++; //Y
      var BEFORE_STYLE_3 = i++; //L
      var BEFORE_STYLE_4 = i++; //E
      var AFTER_STYLE_1 = i++; //T
      var AFTER_STYLE_2 = i++; //Y
      var AFTER_STYLE_3 = i++; //L
      var AFTER_STYLE_4 = i++; //E

      var BEFORE_ENTITY = i++; //&
      var BEFORE_NUMERIC_ENTITY = i++; //#
      var IN_NAMED_ENTITY = i++;
      var IN_NUMERIC_ENTITY = i++;
      var IN_HEX_ENTITY = i++; //X

      var j = 0;

      var SPECIAL_NONE = j++;
      var SPECIAL_SCRIPT = j++;
      var SPECIAL_STYLE = j++;

      function whitespace(c) {
        return c === " " || c === "\n" || c === "\t" || c === "\f" || c === "\r";
      }

      function ifElseState(upper, SUCCESS, FAILURE) {
        var lower = upper.toLowerCase();

        if (upper === lower) {
          return function (c) {
            if (c === lower) {
              this._state = SUCCESS;
            } else {
              this._state = FAILURE;
              this._index--;
            }
          };
        } else {
          return function (c) {
            if (c === lower || c === upper) {
              this._state = SUCCESS;
            } else {
              this._state = FAILURE;
              this._index--;
            }
          };
        }
      }

      function consumeSpecialNameChar(upper, NEXT_STATE) {
        var lower = upper.toLowerCase();

        return function (c) {
          if (c === lower || c === upper) {
            this._state = NEXT_STATE;
          } else {
            this._state = IN_TAG_NAME;
            this._index--; //consume the token again
          }
        };
      }

      function Tokenizer(options, cbs) {
        this._state = TEXT;
        this._buffer = "";
        this._sectionStart = 0;
        this._index = 0;
        this._bufferOffset = 0; //chars removed from _buffer
        this._baseState = TEXT;
        this._special = SPECIAL_NONE;
        this._cbs = cbs;
        this._running = true;
        this._ended = false;
        this._xmlMode = !!(options && options.xmlMode);
        this._decodeEntities = !!(options && options.decodeEntities);
      }

      Tokenizer.prototype._stateText = function (c) {
        if (c === "<") {
          if (this._index > this._sectionStart) {
            this._cbs.ontext(this._getSection());
          }
          this._state = BEFORE_TAG_NAME;
          this._sectionStart = this._index;
        } else if (
          this._decodeEntities &&
          this._special === SPECIAL_NONE &&
          c === "&"
        )
        {
          if (this._index > this._sectionStart) {
            this._cbs.ontext(this._getSection());
          }
          this._baseState = TEXT;
          this._state = BEFORE_ENTITY;
          this._sectionStart = this._index;
        }
      };

      Tokenizer.prototype._stateBeforeTagName = function (c) {
        if (c === "/") {
          this._state = BEFORE_CLOSING_TAG_NAME;
        } else if (c === "<") {
          this._cbs.ontext(this._getSection());
          this._sectionStart = this._index;
        } else if (c === ">" || this._special !== SPECIAL_NONE || whitespace(c)) {
          this._state = TEXT;
        } else if (c === "!") {
          this._state = BEFORE_DECLARATION;
          this._sectionStart = this._index + 1;
        } else if (c === "?") {
          this._state = IN_PROCESSING_INSTRUCTION;
          this._sectionStart = this._index + 1;
        } else {
          this._state =
            !this._xmlMode && (c === "s" || c === "S")
              ? BEFORE_SPECIAL
              : IN_TAG_NAME;
          this._sectionStart = this._index;
        }
      };

      Tokenizer.prototype._stateInTagName = function (c) {
        if (c === "/" || c === ">" || whitespace(c)) {
          this._emitToken("onopentagname");
          this._state = BEFORE_ATTRIBUTE_NAME;
          this._index--;
        }
      };

      Tokenizer.prototype._stateBeforeCloseingTagName = function (c) {
        if (whitespace(c)) {
          ;
        } else if (c === ">") {
          this._state = TEXT;
        } else if (this._special !== SPECIAL_NONE) {
          if (c === "s" || c === "S") {
            this._state = BEFORE_SPECIAL_END;
          } else {
            this._state = TEXT;
            this._index--;
          }
        } else {
          this._state = IN_CLOSING_TAG_NAME;
          this._sectionStart = this._index;
        }
      };

      Tokenizer.prototype._stateInCloseingTagName = function (c) {
        if (c === ">" || whitespace(c)) {
          this._emitToken("onclosetag");
          this._state = AFTER_CLOSING_TAG_NAME;
          this._index--;
        }
      };

      Tokenizer.prototype._stateAfterCloseingTagName = function (c) {
        //skip everything until ">"
        if (c === ">") {
          this._state = TEXT;
          this._sectionStart = this._index + 1;
        }
      };

      Tokenizer.prototype._stateBeforeAttributeName = function (c) {
        if (c === ">") {
          this._cbs.onopentagend();
          this._state = TEXT;
          this._sectionStart = this._index + 1;
        } else if (c === "/") {
          this._state = IN_SELF_CLOSING_TAG;
        } else if (!whitespace(c)) {
          this._state = IN_ATTRIBUTE_NAME;
          this._sectionStart = this._index;
        }
      };

      Tokenizer.prototype._stateInSelfClosingTag = function (c) {
        if (c === ">") {
          this._cbs.onselfclosingtag();
          this._state = TEXT;
          this._sectionStart = this._index + 1;
        } else if (!whitespace(c)) {
          this._state = BEFORE_ATTRIBUTE_NAME;
          this._index--;
        }
      };

      Tokenizer.prototype._stateInAttributeName = function (c) {
        if (c === "=" || c === "/" || c === ">" || whitespace(c)) {
          this._cbs.onattribname(this._getSection());
          this._sectionStart = -1;
          this._state = AFTER_ATTRIBUTE_NAME;
          this._index--;
        }
      };

      Tokenizer.prototype._stateAfterAttributeName = function (c) {
        if (c === "=") {
          this._state = BEFORE_ATTRIBUTE_VALUE;
        } else if (c === "/" || c === ">") {
          this._cbs.onattribend();
          this._state = BEFORE_ATTRIBUTE_NAME;
          this._index--;
        } else if (!whitespace(c)) {
          this._cbs.onattribend();
          this._state = IN_ATTRIBUTE_NAME;
          this._sectionStart = this._index;
        }
      };

      Tokenizer.prototype._stateBeforeAttributeValue = function (c) {
        if (c === '"') {
          this._state = IN_ATTRIBUTE_VALUE_DQ;
          this._sectionStart = this._index + 1;
        } else if (c === "'") {
          this._state = IN_ATTRIBUTE_VALUE_SQ;
          this._sectionStart = this._index + 1;
        } else if (!whitespace(c)) {
          this._state = IN_ATTRIBUTE_VALUE_NQ;
          this._sectionStart = this._index;
          this._index--; //reconsume token
        }
      };

      Tokenizer.prototype._stateInAttributeValueDoubleQuotes = function (c) {
        if (c === '"') {
          this._emitToken("onattribdata");
          this._cbs.onattribend();
          this._state = BEFORE_ATTRIBUTE_NAME;
        } else if (this._decodeEntities && c === "&") {
          this._emitToken("onattribdata");
          this._baseState = this._state;
          this._state = BEFORE_ENTITY;
          this._sectionStart = this._index;
        }
      };

      Tokenizer.prototype._stateInAttributeValueSingleQuotes = function (c) {
        if (c === "'") {
          this._emitToken("onattribdata");
          this._cbs.onattribend();
          this._state = BEFORE_ATTRIBUTE_NAME;
        } else if (this._decodeEntities && c === "&") {
          this._emitToken("onattribdata");
          this._baseState = this._state;
          this._state = BEFORE_ENTITY;
          this._sectionStart = this._index;
        }
      };

      Tokenizer.prototype._stateInAttributeValueNoQuotes = function (c) {
        if (whitespace(c) || c === ">") {
          this._emitToken("onattribdata");
          this._cbs.onattribend();
          this._state = BEFORE_ATTRIBUTE_NAME;
          this._index--;
        } else if (this._decodeEntities && c === "&") {
          this._emitToken("onattribdata");
          this._baseState = this._state;
          this._state = BEFORE_ENTITY;
          this._sectionStart = this._index;
        }
      };

      Tokenizer.prototype._stateBeforeDeclaration = function (c) {
        this._state =
          c === "["
            ? BEFORE_CDATA_1
            : c === "-"
            ? BEFORE_COMMENT
            : IN_DECLARATION;
      };

      Tokenizer.prototype._stateInDeclaration = function (c) {
        if (c === ">") {
          this._cbs.ondeclaration(this._getSection());
          this._state = TEXT;
          this._sectionStart = this._index + 1;
        }
      };

      Tokenizer.prototype._stateInProcessingInstruction = function (c) {
        if (c === ">") {
          this._cbs.onprocessinginstruction(this._getSection());
          this._state = TEXT;
          this._sectionStart = this._index + 1;
        }
      };

      Tokenizer.prototype._stateBeforeComment = function (c) {
        if (c === "-") {
          this._state = IN_COMMENT;
          this._sectionStart = this._index + 1;
        } else {
          this._state = IN_DECLARATION;
        }
      };

      Tokenizer.prototype._stateInComment = function (c) {
        if (c === "-") {
          this._state = AFTER_COMMENT_1;
        }
      };

      Tokenizer.prototype._stateAfterComment1 = function (c) {
        if (c === "-") {
          this._state = AFTER_COMMENT_2;
        } else {
          this._state = IN_COMMENT;
        }
      };

      Tokenizer.prototype._stateAfterComment2 = function (c) {
        if (c === ">") {
          //remove 2 trailing chars
          this._cbs.oncomment(
            this._buffer.substring(this._sectionStart, this._index - 2)
          );
          this._state = TEXT;
          this._sectionStart = this._index + 1;
        } else if (c !== "-") {
          this._state = IN_COMMENT;
        }
        // else: stay in AFTER_COMMENT_2 (`--->`)
      };

      Tokenizer.prototype._stateBeforeCdata1 = ifElseState(
        "C",
        BEFORE_CDATA_2,
        IN_DECLARATION
      );
      Tokenizer.prototype._stateBeforeCdata2 = ifElseState(
        "D",
        BEFORE_CDATA_3,
        IN_DECLARATION
      );
      Tokenizer.prototype._stateBeforeCdata3 = ifElseState(
        "A",
        BEFORE_CDATA_4,
        IN_DECLARATION
      );
      Tokenizer.prototype._stateBeforeCdata4 = ifElseState(
        "T",
        BEFORE_CDATA_5,
        IN_DECLARATION
      );
      Tokenizer.prototype._stateBeforeCdata5 = ifElseState(
        "A",
        BEFORE_CDATA_6,
        IN_DECLARATION
      );

      Tokenizer.prototype._stateBeforeCdata6 = function (c) {
        if (c === "[") {
          this._state = IN_CDATA;
          this._sectionStart = this._index + 1;
        } else {
          this._state = IN_DECLARATION;
          this._index--;
        }
      };

      Tokenizer.prototype._stateInCdata = function (c) {
        if (c === "]") {
          this._state = AFTER_CDATA_1;
        }
      };

      Tokenizer.prototype._stateAfterCdata1 = function (c) {
        if (c === "]") {
          this._state = AFTER_CDATA_2;
        } else {
          this._state = IN_CDATA;
        }
      };

      Tokenizer.prototype._stateAfterCdata2 = function (c) {
        if (c === ">") {
          //remove 2 trailing chars
          this._cbs.oncdata(
            this._buffer.substring(this._sectionStart, this._index - 2)
          );
          this._state = TEXT;
          this._sectionStart = this._index + 1;
        } else if (c !== "]") {
          this._state = IN_CDATA;
        }
        //else: stay in AFTER_CDATA_2 (`]]]>`)
      };

      Tokenizer.prototype._stateBeforeSpecial = function (c) {
        if (c === "c" || c === "C") {
          this._state = BEFORE_SCRIPT_1;
        } else if (c === "t" || c === "T") {
          this._state = BEFORE_STYLE_1;
        } else {
          this._state = IN_TAG_NAME;
          this._index--; //consume the token again
        }
      };

      Tokenizer.prototype._stateBeforeSpecialEnd = function (c) {
        if (this._special === SPECIAL_SCRIPT && (c === "c" || c === "C")) {
          this._state = AFTER_SCRIPT_1;
        } else if (this._special === SPECIAL_STYLE && (c === "t" || c === "T")) {
          this._state = AFTER_STYLE_1;
        } else {
          this._state = TEXT;
        }
      };

      Tokenizer.prototype._stateBeforeScript1 = consumeSpecialNameChar(
        "R",
        BEFORE_SCRIPT_2
      );
      Tokenizer.prototype._stateBeforeScript2 = consumeSpecialNameChar(
        "I",
        BEFORE_SCRIPT_3
      );
      Tokenizer.prototype._stateBeforeScript3 = consumeSpecialNameChar(
        "P",
        BEFORE_SCRIPT_4
      );
      Tokenizer.prototype._stateBeforeScript4 = consumeSpecialNameChar(
        "T",
        BEFORE_SCRIPT_5
      );

      Tokenizer.prototype._stateBeforeScript5 = function (c) {
        if (c === "/" || c === ">" || whitespace(c)) {
          this._special = SPECIAL_SCRIPT;
        }
        this._state = IN_TAG_NAME;
        this._index--; //consume the token again
      };

      Tokenizer.prototype._stateAfterScript1 = ifElseState("R", AFTER_SCRIPT_2, TEXT);
      Tokenizer.prototype._stateAfterScript2 = ifElseState("I", AFTER_SCRIPT_3, TEXT);
      Tokenizer.prototype._stateAfterScript3 = ifElseState("P", AFTER_SCRIPT_4, TEXT);
      Tokenizer.prototype._stateAfterScript4 = ifElseState("T", AFTER_SCRIPT_5, TEXT);

      Tokenizer.prototype._stateAfterScript5 = function (c) {
        if (c === ">" || whitespace(c)) {
          this._special = SPECIAL_NONE;
          this._state = IN_CLOSING_TAG_NAME;
          this._sectionStart = this._index - 6;
          this._index--; //reconsume the token
        } else {
          this._state = TEXT;
        }
      };

      Tokenizer.prototype._stateBeforeStyle1 = consumeSpecialNameChar(
        "Y",
        BEFORE_STYLE_2
      );
      Tokenizer.prototype._stateBeforeStyle2 = consumeSpecialNameChar(
        "L",
        BEFORE_STYLE_3
      );
      Tokenizer.prototype._stateBeforeStyle3 = consumeSpecialNameChar(
        "E",
        BEFORE_STYLE_4
      );

      Tokenizer.prototype._stateBeforeStyle4 = function (c) {
        if (c === "/" || c === ">" || whitespace(c)) {
          this._special = SPECIAL_STYLE;
        }
        this._state = IN_TAG_NAME;
        this._index--; //consume the token again
      };

      Tokenizer.prototype._stateAfterStyle1 = ifElseState("Y", AFTER_STYLE_2, TEXT);
      Tokenizer.prototype._stateAfterStyle2 = ifElseState("L", AFTER_STYLE_3, TEXT);
      Tokenizer.prototype._stateAfterStyle3 = ifElseState("E", AFTER_STYLE_4, TEXT);

      Tokenizer.prototype._stateAfterStyle4 = function (c) {
        if (c === ">" || whitespace(c)) {
          this._special = SPECIAL_NONE;
          this._state = IN_CLOSING_TAG_NAME;
          this._sectionStart = this._index - 5;
          this._index--; //reconsume the token
        } else {
          this._state = TEXT;
        }
      };

      Tokenizer.prototype._stateBeforeEntity = ifElseState(
        "#",
        BEFORE_NUMERIC_ENTITY,
        IN_NAMED_ENTITY
      );
      Tokenizer.prototype._stateBeforeNumericEntity = ifElseState(
        "X",
        IN_HEX_ENTITY,
        IN_NUMERIC_ENTITY
      );

//for entities terminated with a semicolon
      Tokenizer.prototype._parseNamedEntityStrict = function () {
        //offset = 1
        if (this._sectionStart + 1 < this._index) {
          var entity = this._buffer.substring(
            this._sectionStart + 1,
            this._index
            ),
            map = this._xmlMode ? xmlMap : entityMap;

          if (map.hasOwnProperty(entity)) {
            this._emitPartial(map[entity]);
            this._sectionStart = this._index + 1;
          }
        }
      };

//parses legacy entities (without trailing semicolon)
      Tokenizer.prototype._parseLegacyEntity = function () {
        var start = this._sectionStart + 1,
          limit = this._index - start;

        if (limit > 6) {
          limit = 6;
        } //the max length of legacy entities is 6

        while (limit >= 2) {
          //the min length of legacy entities is 2
          var entity = this._buffer.substr(start, limit);

          if (legacyMap.hasOwnProperty(entity)) {
            this._emitPartial(legacyMap[entity]);
            this._sectionStart += limit + 1;
            return;
          } else {
            limit--;
          }
        }
      };

      Tokenizer.prototype._stateInNamedEntity = function (c) {
        if (c === ";") {
          this._parseNamedEntityStrict();
          if (this._sectionStart + 1 < this._index && !this._xmlMode) {
            this._parseLegacyEntity();
          }
          this._state = this._baseState;
        } else if (
          (c < "a" || c > "z") &&
          (c < "A" || c > "Z") &&
          (c < "0" || c > "9")
        )
        {
          if (this._xmlMode) {
            ;
          } else if (this._sectionStart + 1 === this._index) {
            ;
          } else if (this._baseState !== TEXT) {
            if (c !== "=") {
              this._parseNamedEntityStrict();
            }
          } else {
            this._parseLegacyEntity();
          }

          this._state = this._baseState;
          this._index--;
        }
      };

      Tokenizer.prototype._decodeNumericEntity = function (offset, base) {
        var sectionStart = this._sectionStart + offset;

        if (sectionStart !== this._index) {
          //parse entity
          var entity = this._buffer.substring(sectionStart, this._index);
          var parsed = parseInt(entity, base);

          this._emitPartial(decodeCodePoint(parsed));
          this._sectionStart = this._index;
        } else {
          this._sectionStart--;
        }

        this._state = this._baseState;
      };

      Tokenizer.prototype._stateInNumericEntity = function (c) {
        if (c === ";") {
          this._decodeNumericEntity(2, 10);
          this._sectionStart++;
        } else if (c < "0" || c > "9") {
          if (!this._xmlMode) {
            this._decodeNumericEntity(2, 10);
          } else {
            this._state = this._baseState;
          }
          this._index--;
        }
      };

      Tokenizer.prototype._stateInHexEntity = function (c) {
        if (c === ";") {
          this._decodeNumericEntity(3, 16);
          this._sectionStart++;
        } else if (
          (c < "a" || c > "f") &&
          (c < "A" || c > "F") &&
          (c < "0" || c > "9")
        )
        {
          if (!this._xmlMode) {
            this._decodeNumericEntity(3, 16);
          } else {
            this._state = this._baseState;
          }
          this._index--;
        }
      };

      Tokenizer.prototype._cleanup = function () {
        if (this._sectionStart < 0) {
          this._buffer = "";
          this._bufferOffset += this._index;
          this._index = 0;
        } else if (this._running) {
          if (this._state === TEXT) {
            if (this._sectionStart !== this._index) {
              this._cbs.ontext(this._buffer.substr(this._sectionStart));
            }
            this._buffer = "";
            this._bufferOffset += this._index;
            this._index = 0;
          } else if (this._sectionStart === this._index) {
            //the section just started
            this._buffer = "";
            this._bufferOffset += this._index;
            this._index = 0;
          } else {
            //remove everything unnecessary
            this._buffer = this._buffer.substr(this._sectionStart);
            this._index -= this._sectionStart;
            this._bufferOffset += this._sectionStart;
          }

          this._sectionStart = 0;
        }
      };

//TODO make events conditional
      Tokenizer.prototype.write = function (chunk) {
        if (this._ended) {
          this._cbs.onerror(Error(".write() after done!"));
        }

        this._buffer += chunk;
        this._parse();
      };

      Tokenizer.prototype._parse = function () {
        while (this._index < this._buffer.length && this._running) {
          var c = this._buffer.charAt(this._index);
          if (this._state === TEXT) {
            this._stateText(c);
          } else if (this._state === BEFORE_TAG_NAME) {
            this._stateBeforeTagName(c);
          } else if (this._state === IN_TAG_NAME) {
            this._stateInTagName(c);
          } else if (this._state === BEFORE_CLOSING_TAG_NAME) {
            this._stateBeforeCloseingTagName(c);
          } else if (this._state === IN_CLOSING_TAG_NAME) {
            this._stateInCloseingTagName(c);
          } else if (this._state === AFTER_CLOSING_TAG_NAME) {
            this._stateAfterCloseingTagName(c);
          } else if (this._state === IN_SELF_CLOSING_TAG) {
            this._stateInSelfClosingTag(c);
          } else if (this._state === BEFORE_ATTRIBUTE_NAME) {

            /*
		*	attributes
		*/
            this._stateBeforeAttributeName(c);
          } else if (this._state === IN_ATTRIBUTE_NAME) {
            this._stateInAttributeName(c);
          } else if (this._state === AFTER_ATTRIBUTE_NAME) {
            this._stateAfterAttributeName(c);
          } else if (this._state === BEFORE_ATTRIBUTE_VALUE) {
            this._stateBeforeAttributeValue(c);
          } else if (this._state === IN_ATTRIBUTE_VALUE_DQ) {
            this._stateInAttributeValueDoubleQuotes(c);
          } else if (this._state === IN_ATTRIBUTE_VALUE_SQ) {
            this._stateInAttributeValueSingleQuotes(c);
          } else if (this._state === IN_ATTRIBUTE_VALUE_NQ) {
            this._stateInAttributeValueNoQuotes(c);
          } else if (this._state === BEFORE_DECLARATION) {

            /*
		*	declarations
		*/
            this._stateBeforeDeclaration(c);
          } else if (this._state === IN_DECLARATION) {
            this._stateInDeclaration(c);
          } else if (this._state === IN_PROCESSING_INSTRUCTION) {

            /*
		*	processing instructions
		*/
            this._stateInProcessingInstruction(c);
          } else if (this._state === BEFORE_COMMENT) {

            /*
		*	comments
		*/
            this._stateBeforeComment(c);
          } else if (this._state === IN_COMMENT) {
            this._stateInComment(c);
          } else if (this._state === AFTER_COMMENT_1) {
            this._stateAfterComment1(c);
          } else if (this._state === AFTER_COMMENT_2) {
            this._stateAfterComment2(c);
          } else if (this._state === BEFORE_CDATA_1) {

            /*
		*	cdata
		*/
            this._stateBeforeCdata1(c);
          } else if (this._state === BEFORE_CDATA_2) {
            this._stateBeforeCdata2(c);
          } else if (this._state === BEFORE_CDATA_3) {
            this._stateBeforeCdata3(c);
          } else if (this._state === BEFORE_CDATA_4) {
            this._stateBeforeCdata4(c);
          } else if (this._state === BEFORE_CDATA_5) {
            this._stateBeforeCdata5(c);
          } else if (this._state === BEFORE_CDATA_6) {
            this._stateBeforeCdata6(c);
          } else if (this._state === IN_CDATA) {
            this._stateInCdata(c);
          } else if (this._state === AFTER_CDATA_1) {
            this._stateAfterCdata1(c);
          } else if (this._state === AFTER_CDATA_2) {
            this._stateAfterCdata2(c);
          } else if (this._state === BEFORE_SPECIAL) {

            /*
		* special tags
		*/
            this._stateBeforeSpecial(c);
          } else if (this._state === BEFORE_SPECIAL_END) {
            this._stateBeforeSpecialEnd(c);
          } else if (this._state === BEFORE_SCRIPT_1) {

            /*
		* script
		*/
            this._stateBeforeScript1(c);
          } else if (this._state === BEFORE_SCRIPT_2) {
            this._stateBeforeScript2(c);
          } else if (this._state === BEFORE_SCRIPT_3) {
            this._stateBeforeScript3(c);
          } else if (this._state === BEFORE_SCRIPT_4) {
            this._stateBeforeScript4(c);
          } else if (this._state === BEFORE_SCRIPT_5) {
            this._stateBeforeScript5(c);
          } else if (this._state === AFTER_SCRIPT_1) {
            this._stateAfterScript1(c);
          } else if (this._state === AFTER_SCRIPT_2) {
            this._stateAfterScript2(c);
          } else if (this._state === AFTER_SCRIPT_3) {
            this._stateAfterScript3(c);
          } else if (this._state === AFTER_SCRIPT_4) {
            this._stateAfterScript4(c);
          } else if (this._state === AFTER_SCRIPT_5) {
            this._stateAfterScript5(c);
          } else if (this._state === BEFORE_STYLE_1) {

            /*
		* style
		*/
            this._stateBeforeStyle1(c);
          } else if (this._state === BEFORE_STYLE_2) {
            this._stateBeforeStyle2(c);
          } else if (this._state === BEFORE_STYLE_3) {
            this._stateBeforeStyle3(c);
          } else if (this._state === BEFORE_STYLE_4) {
            this._stateBeforeStyle4(c);
          } else if (this._state === AFTER_STYLE_1) {
            this._stateAfterStyle1(c);
          } else if (this._state === AFTER_STYLE_2) {
            this._stateAfterStyle2(c);
          } else if (this._state === AFTER_STYLE_3) {
            this._stateAfterStyle3(c);
          } else if (this._state === AFTER_STYLE_4) {
            this._stateAfterStyle4(c);
          } else if (this._state === BEFORE_ENTITY) {

            /*
		* entities
		*/
            this._stateBeforeEntity(c);
          } else if (this._state === BEFORE_NUMERIC_ENTITY) {
            this._stateBeforeNumericEntity(c);
          } else if (this._state === IN_NAMED_ENTITY) {
            this._stateInNamedEntity(c);
          } else if (this._state === IN_NUMERIC_ENTITY) {
            this._stateInNumericEntity(c);
          } else if (this._state === IN_HEX_ENTITY) {
            this._stateInHexEntity(c);
          } else {
            this._cbs.onerror(Error("unknown _state"), this._state);
          }

          this._index++;
        }

        this._cleanup();
      };

      Tokenizer.prototype.pause = function () {
        this._running = false;
      };
      Tokenizer.prototype.resume = function () {
        this._running = true;

        if (this._index < this._buffer.length) {
          this._parse();
        }
        if (this._ended) {
          this._finish();
        }
      };

      Tokenizer.prototype.end = function (chunk) {
        if (this._ended) {
          this._cbs.onerror(Error(".end() after done!"));
        }
        if (chunk) {
          this.write(chunk);
        }

        this._ended = true;

        if (this._running) {
          this._finish();
        }
      };

      Tokenizer.prototype._finish = function () {
        //if there is remaining data, emit it in a reasonable way
        if (this._sectionStart < this._index) {
          this._handleTrailingData();
        }

        this._cbs.onend();
      };

      Tokenizer.prototype._handleTrailingData = function () {
        var data = this._buffer.substr(this._sectionStart);

        if (
          this._state === IN_CDATA ||
          this._state === AFTER_CDATA_1 ||
          this._state === AFTER_CDATA_2
        )
        {
          this._cbs.oncdata(data);
        } else if (
          this._state === IN_COMMENT ||
          this._state === AFTER_COMMENT_1 ||
          this._state === AFTER_COMMENT_2
        )
        {
          this._cbs.oncomment(data);
        } else if (this._state === IN_NAMED_ENTITY && !this._xmlMode) {
          this._parseLegacyEntity();
          if (this._sectionStart < this._index) {
            this._state = this._baseState;
            this._handleTrailingData();
          }
        } else if (this._state === IN_NUMERIC_ENTITY && !this._xmlMode) {
          this._decodeNumericEntity(2, 10);
          if (this._sectionStart < this._index) {
            this._state = this._baseState;
            this._handleTrailingData();
          }
        } else if (this._state === IN_HEX_ENTITY && !this._xmlMode) {
          this._decodeNumericEntity(3, 16);
          if (this._sectionStart < this._index) {
            this._state = this._baseState;
            this._handleTrailingData();
          }
        } else if (
          this._state !== IN_TAG_NAME &&
          this._state !== BEFORE_ATTRIBUTE_NAME &&
          this._state !== BEFORE_ATTRIBUTE_VALUE &&
          this._state !== AFTER_ATTRIBUTE_NAME &&
          this._state !== IN_ATTRIBUTE_NAME &&
          this._state !== IN_ATTRIBUTE_VALUE_SQ &&
          this._state !== IN_ATTRIBUTE_VALUE_DQ &&
          this._state !== IN_ATTRIBUTE_VALUE_NQ &&
          this._state !== IN_CLOSING_TAG_NAME
        )
        {
          this._cbs.ontext(data);
        }
        //else, ignore remaining data
        //TODO add a way to remove current tag
      };

      Tokenizer.prototype.reset = function () {
        Tokenizer.call(
          this,
          { xmlMode: this._xmlMode, decodeEntities: this._decodeEntities },
          this._cbs
        );
      };

      Tokenizer.prototype.getAbsoluteIndex = function () {
        return this._bufferOffset + this._index;
      };

      Tokenizer.prototype._getSection = function () {
        return this._buffer.substring(this._sectionStart, this._index);
      };

      Tokenizer.prototype._emitToken = function (name) {
        this._cbs[name](this._getSection());
        this._sectionStart = -1;
      };

      Tokenizer.prototype._emitPartial = function (value) {
        if (this._baseState !== TEXT) {
          this._cbs.onattribdata(value); //TODO implement the new event
        } else {
          this._cbs.ontext(value);
        }
      };

    }, {
      "entities/lib/decode_codepoint.js": 28,
      "entities/maps/entities.json": 31,
      "entities/maps/legacy.json": 32,
      "entities/maps/xml.json": 33
    }],
    40: [function (require, module, exports) {
      module.exports = Stream;

      var Parser = require("./Parser.js");
      var WritableStream = require("readable-stream").Writable;
      var StringDecoder = require("string_decoder").StringDecoder;
      var Buffer = require("buffer").Buffer;

      function Stream(cbs, options) {
        var parser = (this._parser = new Parser(cbs, options));
        var decoder = (this._decoder = new StringDecoder());

        WritableStream.call(this, { decodeStrings: false });

        this.once("finish", function () {
          parser.end(decoder.end());
        });
      }

      require("inherits")(Stream, WritableStream);

      Stream.prototype._write = function (chunk, encoding, cb) {
        if (chunk instanceof Buffer) {
          chunk = this._decoder.write(chunk);
        }
        this._parser.write(chunk);
        cb();
      };

    }, { "./Parser.js": 36, "buffer": undefined, "inherits": 42, "readable-stream": 61, "string_decoder": undefined }],
    41: [function (require, module, exports) {
      var Parser = require("./Parser.js");
      var DomHandler = require("domhandler");

      function defineProp(name, value) {
        delete module.exports[name];
        module.exports[name] = value;
        return value;
      }

      module.exports = {
        Parser: Parser,
        Tokenizer: require("./Tokenizer.js"),
        ElementType: require("domelementtype"),
        DomHandler: DomHandler,
        get FeedHandler() {
          return defineProp("FeedHandler", require("./FeedHandler.js"));
        },
        get Stream() {
          return defineProp("Stream", require("./Stream.js"));
        },
        get WritableStream() {
          return defineProp("WritableStream", require("./WritableStream.js"));
        },
        get ProxyHandler() {
          return defineProp("ProxyHandler", require("./ProxyHandler.js"));
        },
        get DomUtils() {
          return defineProp("DomUtils", require("domutils"));
        },
        get CollectingHandler() {
          return defineProp(
            "CollectingHandler",
            require("./CollectingHandler.js")
          );
        },
        // For legacy support
        DefaultHandler: DomHandler,
        get RssHandler() {
          return defineProp("RssHandler", this.FeedHandler);
        },
        //helper methods
        parseDOM: function (data, options) {
          var handler = new DomHandler(options);
          new Parser(handler, options).end(data);
          return handler.dom;
        },
        parseFeed: function (feed, options) {
          var handler = new module.exports.FeedHandler(options);
          new Parser(handler, options).end(feed);
          return handler.dom;
        },
        createDomStream: function (cb, options, elementCb) {
          var handler = new DomHandler(cb, options, elementCb);
          return new Parser(handler, options);
        },
        // List of all events that the parser emits
        EVENTS: {
          /* Format: eventname: number of arguments */
          attribute: 2,
          cdatastart: 0,
          cdataend: 0,
          text: 1,
          processinginstruction: 2,
          comment: 1,
          commentend: 0,
          closetag: 1,
          opentag: 2,
          opentagname: 1,
          error: 1,
          end: 0
        }
      };

    }, {
      "./CollectingHandler.js": 34,
      "./FeedHandler.js": 35,
      "./Parser.js": 36,
      "./ProxyHandler.js": 37,
      "./Stream.js": 38,
      "./Tokenizer.js": 39,
      "./WritableStream.js": 40,
      "domelementtype": 15,
      "domhandler": 16,
      "domutils": 19
    }],
    42: [function (require, module, exports) {
      if (typeof Object.create === 'function') {
        // implementation from standard node.js 'util' module
        module.exports = function inherits(ctor, superCtor) {
          ctor.super_ = superCtor
          ctor.prototype = Object.create(superCtor.prototype, {
            constructor: {
              value: ctor,
              enumerable: false,
              writable: true,
              configurable: true
            }
          });
        };
      } else {
        // old school shim for old browsers
        module.exports = function inherits(ctor, superCtor) {
          ctor.super_ = superCtor
          var TempCtor = function () {
          }
          TempCtor.prototype = superCtor.prototype
          ctor.prototype = new TempCtor()
          ctor.prototype.constructor = ctor
        }
      }

    }, {}],
    43: [function (require, module, exports) {
      module.exports = function isArrayish(obj) {
        if (!obj || typeof obj === 'string') {
          return false;
        }

        return obj instanceof Array || Array.isArray(obj) ||
          (obj.length >= 0 && (obj.splice instanceof Function ||
            (Object.getOwnPropertyDescriptor(obj, (obj.length - 1)) && obj.constructor.name !== 'String')));
      };

    }, {}],
    44: [function (require, module, exports) {
// Copyright 2014 Simon Lydell
// X11 (“MIT”) Licensed. (See LICENSE.)

      void (function (root, factory) {
        if (typeof define === "function" && define.amd) {
          define(factory)
        } else if (typeof exports === "object") {
          module.exports = factory()
        } else {
          root.resolveUrl = factory()
        }
      }(this, function () {

        function resolveUrl(/* ...urls */) {
          var numUrls = arguments.length

          if (numUrls === 0) {
            throw new Error("resolveUrl requires at least one argument; got none.")
          }

          var base = document.createElement("base")
          base.href = arguments[0]

          if (numUrls === 1) {
            return base.href
          }

          var head = document.getElementsByTagName("head")[0]
          head.insertBefore(base, head.firstChild)

          var a = document.createElement("a")
          var resolved

          for (var index = 1; index < numUrls; index++) {
            a.href = arguments[index]
            resolved = a.href
            base.href = resolved
          }

          head.removeChild(base)

          return resolved
        }

        return resolveUrl

      }));

    }, {}],
    45: [function (require, module, exports) {
      'use strict';

      var isArrayish = require('is-arrayish');

      var concat = Array.prototype.concat;
      var slice = Array.prototype.slice;

      var swizzle = module.exports = function swizzle(args) {
        var results = [];

        for (var i = 0, len = args.length; i < len; i++) {
          var arg = args[i];

          if (isArrayish(arg)) {
            // http://jsperf.com/javascript-array-concat-vs-push/98
            results = concat.call(results, slice.call(arg));
          } else {
            results.push(arg);
          }
        }

        return results;
      };

      swizzle.wrap = function (fn) {
        return function () {
          return fn(swizzle(arguments));
        };
      };

    }, { "is-arrayish": 43 }],
    46: [function (require, module, exports) {
// Copyright 2014, 2015, 2016, 2017 Simon Lydell
// X11 (“MIT”) Licensed. (See LICENSE.)

// Note: source-map-resolve.js is generated from source-map-resolve-node.js and
// source-map-resolve-template.js. Only edit the two latter files, _not_
// source-map-resolve.js!

      void (function (root, factory) {
        if (typeof define === "function" && define.amd) {
          define(["source-map-url", "resolve-url"], factory)
        } else if (typeof exports === "object") {
          var sourceMappingURL = require("source-map-url")
          var resolveUrl = require("resolve-url")
          module.exports = factory(sourceMappingURL, resolveUrl)
        } else {
          root.sourceMapResolve = factory(root.sourceMappingURL, root.resolveUrl)
        }
      }(this, function (sourceMappingURL, resolveUrl) {

        function callbackAsync(callback, error, result) {
          setImmediate(function () {
            callback(error, result)
          })
        }

        function parseMapToJSON(string, data) {
          try {
            return JSON.parse(string.replace(/^\)\]\}'/, ""))
          } catch (error) {
            error.sourceMapData = data
            throw error
          }
        }

        function readSync(read, url, data) {
          var readUrl = url
          try {
            return String(read(readUrl))
          } catch (error) {
            error.sourceMapData = data
            throw error
          }
        }


        function resolveSourceMap(code, codeUrl, read, callback) {
          var mapData
          try {
            mapData = resolveSourceMapHelper(code, codeUrl)
          } catch (error) {
            return callbackAsync(callback, error)
          }
          if (!mapData || mapData.map) {
            return callbackAsync(callback, null, mapData)
          }
          var readUrl = mapData.url
          read(readUrl, function (error, result) {
            if (error) {
              error.sourceMapData = mapData
              return callback(error)
            }
            mapData.map = String(result)
            try {
              mapData.map = parseMapToJSON(mapData.map, mapData)
            } catch (error) {
              return callback(error)
            }
            callback(null, mapData)
          })
        }

        function resolveSourceMapSync(code, codeUrl, read) {
          var mapData = resolveSourceMapHelper(code, codeUrl)
          if (!mapData || mapData.map) {
            return mapData
          }
          mapData.map = readSync(read, mapData.url, mapData)
          mapData.map = parseMapToJSON(mapData.map, mapData)
          return mapData
        }

        var dataUriRegex = /^data:([^,;]*)(;[^,;]*)*(?:,(.*))?$/
        var jsonMimeTypeRegex = /^(?:application|text)\/json$/

        function resolveSourceMapHelper(code, codeUrl) {
          var url = sourceMappingURL.getFrom(code)
          if (!url) {
            return null
          }

          var dataUri = url.match(dataUriRegex)
          if (dataUri) {
            var mimeType = dataUri[1]
            var lastParameter = dataUri[2] || ""
            var encoded = dataUri[3] || ""
            var data = {
              sourceMappingURL: url,
              url: null,
              sourcesRelativeTo: codeUrl,
              map: encoded
            }
            if (!jsonMimeTypeRegex.test(mimeType)) {
              var error = new Error("Unuseful data uri mime type: " + (mimeType || "text/plain"))
              error.sourceMapData = data
              throw error
            }
            data.map = parseMapToJSON(
              lastParameter === ";base64" ? atob(encoded) : decodeURIComponent(encoded),
              data
            )
            return data
          }

          var mapUrl = resolveUrl(codeUrl, url)
          return {
            sourceMappingURL: url,
            url: mapUrl,
            sourcesRelativeTo: mapUrl,
            map: null
          }
        }


        function resolveSources(map, mapUrl, read, options, callback) {
          if (typeof options === "function") {
            callback = options
            options = {}
          }
          var pending = map.sources ? map.sources.length : 0
          var result = {
            sourcesResolved: [],
            sourcesContent: []
          }

          if (pending === 0) {
            callbackAsync(callback, null, result)
            return
          }

          var done = function () {
            pending--
            if (pending === 0) {
              callback(null, result)
            }
          }

          resolveSourcesHelper(map, mapUrl, options, function (fullUrl, sourceContent, index) {
            result.sourcesResolved[index] = fullUrl
            if (typeof sourceContent === "string") {
              result.sourcesContent[index] = sourceContent
              callbackAsync(done, null)
            } else {
              var readUrl = fullUrl
              read(readUrl, function (error, source) {
                result.sourcesContent[index] = error ? error : String(source)
                done()
              })
            }
          })
        }

        function resolveSourcesSync(map, mapUrl, read, options) {
          var result = {
            sourcesResolved: [],
            sourcesContent: []
          }

          if (!map.sources || map.sources.length === 0) {
            return result
          }

          resolveSourcesHelper(map, mapUrl, options, function (fullUrl, sourceContent, index) {
            result.sourcesResolved[index] = fullUrl
            if (read !== null) {
              if (typeof sourceContent === "string") {
                result.sourcesContent[index] = sourceContent
              } else {
                var readUrl = fullUrl
                try {
                  result.sourcesContent[index] = String(read(readUrl))
                } catch (error) {
                  result.sourcesContent[index] = error
                }
              }
            }
          })

          return result
        }

        var endingSlash = /\/?$/

        function resolveSourcesHelper(map, mapUrl, options, fn) {
          options = options || {}
          var fullUrl
          var sourceContent
          var sourceRoot
          for (var index = 0, len = map.sources.length; index < len; index++) {
            sourceRoot = null
            if (typeof options.sourceRoot === "string") {
              sourceRoot = options.sourceRoot
            } else if (typeof map.sourceRoot === "string" && options.sourceRoot !== false) {
              sourceRoot = map.sourceRoot
            }
            // If the sourceRoot is the empty string, it is equivalent to not setting
            // the property at all.
            if (sourceRoot === null || sourceRoot === '') {
              fullUrl = resolveUrl(mapUrl, map.sources[index])
            } else {
              // Make sure that the sourceRoot ends with a slash, so that `/scripts/subdir` becomes
              // `/scripts/subdir/<source>`, not `/scripts/<source>`. Pointing to a file as source root
              // does not make sense.
              fullUrl = resolveUrl(mapUrl, sourceRoot.replace(endingSlash, "/"), map.sources[index])
            }
            sourceContent = (map.sourcesContent || [])[index]
            fn(fullUrl, sourceContent, index)
          }
        }


        function resolve(code, codeUrl, read, options, callback) {
          if (typeof options === "function") {
            callback = options
            options = {}
          }
          if (code === null) {
            var mapUrl = codeUrl
            var data = {
              sourceMappingURL: null,
              url: mapUrl,
              sourcesRelativeTo: mapUrl,
              map: null
            }
            var readUrl = mapUrl
            read(readUrl, function (error, result) {
              if (error) {
                error.sourceMapData = data
                return callback(error)
              }
              data.map = String(result)
              try {
                data.map = parseMapToJSON(data.map, data)
              } catch (error) {
                return callback(error)
              }
              _resolveSources(data)
            })
          } else {
            resolveSourceMap(code, codeUrl, read, function (error, mapData) {
              if (error) {
                return callback(error)
              }
              if (!mapData) {
                return callback(null, null)
              }
              _resolveSources(mapData)
            })
          }

          function _resolveSources(mapData) {
            resolveSources(mapData.map, mapData.sourcesRelativeTo, read, options, function (error, result) {
              if (error) {
                return callback(error)
              }
              mapData.sourcesResolved = result.sourcesResolved
              mapData.sourcesContent = result.sourcesContent
              callback(null, mapData)
            })
          }
        }

        function resolveSync(code, codeUrl, read, options) {
          var mapData
          if (code === null) {
            var mapUrl = codeUrl
            mapData = {
              sourceMappingURL: null,
              url: mapUrl,
              sourcesRelativeTo: mapUrl,
              map: null
            }
            mapData.map = readSync(read, mapUrl, mapData)
            mapData.map = parseMapToJSON(mapData.map, mapData)
          } else {
            mapData = resolveSourceMapSync(code, codeUrl, read)
            if (!mapData) {
              return null
            }
          }
          var result = resolveSourcesSync(mapData.map, mapData.sourcesRelativeTo, read, options)
          mapData.sourcesResolved = result.sourcesResolved
          mapData.sourcesContent = result.sourcesContent
          return mapData
        }


        return {
          resolveSourceMap: resolveSourceMap,
          resolveSourceMapSync: resolveSourceMapSync,
          resolveSources: resolveSources,
          resolveSourcesSync: resolveSourcesSync,
          resolve: resolve,
          resolveSync: resolveSync,
          parseMapToJSON: parseMapToJSON
        }

      }));

    }, { "resolve-url": 44, "source-map-url": 47 }],
    47: [function (require, module, exports) {
// Copyright 2014 Simon Lydell
// X11 (“MIT”) Licensed. (See LICENSE.)

      void (function (root, factory) {
        if (typeof define === "function" && define.amd) {
          define(factory)
        } else if (typeof exports === "object") {
          module.exports = factory()
        } else {
          root.sourceMappingURL = factory()
        }
      }(this, function () {

        var innerRegex = /[#@] sourceMappingURL=([^\s'"]*)/

        var regex = RegExp(
          "(?:" +
          "/\\*" +
          "(?:\\s*\r?\n(?://)?)?" +
          "(?:" + innerRegex.source + ")" +
          "\\s*" +
          "\\*/" +
          "|" +
          "//(?:" + innerRegex.source + ")" +
          ")" +
          "\\s*"
        )

        return {

          regex: regex,
          _innerRegex: innerRegex,

          getFrom: function (code) {
            var match = code.match(regex)
            return (match ? match[1] || match[2] || "" : null)
          },

          existsIn: function (code) {
            return regex.test(code)
          },

          removeFrom: function (code) {
            return code.replace(regex, "")
          },

          insertBefore: function (code, string) {
            var match = code.match(regex)
            if (match) {
              return code.slice(0, match.index) + string + code.slice(match.index)
            } else {
              return code + string
            }
          }
        }

      }));

    }, {}],
    48: [function (require, module, exports) {
      /* -*- Mode: js; js-indent-level: 2; -*- */
      /*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

      var util = require('./util');
      var has = Object.prototype.hasOwnProperty;
      var hasNativeMap = typeof Map !== "undefined";

      /**
       * A data structure which is a combination of an array and a set. Adding a new
       * member is O(1), testing for membership is O(1), and finding the index of an
       * element is O(1). Removing elements from the set is not supported. Only
       * strings are supported for membership.
       */
      function ArraySet() {
        this._array = [];
        this._set = hasNativeMap ? new Map() : Object.create(null);
      }

      /**
       * Static method for creating ArraySet instances from an existing array.
       */
      ArraySet.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
        var set = new ArraySet();
        for (var i = 0, len = aArray.length; i < len; i++) {
          set.add(aArray[i], aAllowDuplicates);
        }
        return set;
      };

      /**
       * Return how many unique items are in this ArraySet. If duplicates have been
       * added, than those do not count towards the size.
       *
       * @returns Number
       */
      ArraySet.prototype.size = function ArraySet_size() {
        return hasNativeMap ? this._set.size : Object.getOwnPropertyNames(this._set).length;
      };

      /**
       * Add the given string to this set.
       *
       * @param String aStr
       */
      ArraySet.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
        var sStr = hasNativeMap ? aStr : util.toSetString(aStr);
        var isDuplicate = hasNativeMap ? this.has(aStr) : has.call(this._set, sStr);
        var idx = this._array.length;
        if (!isDuplicate || aAllowDuplicates) {
          this._array.push(aStr);
        }
        if (!isDuplicate) {
          if (hasNativeMap) {
            this._set.set(aStr, idx);
          } else {
            this._set[sStr] = idx;
          }
        }
      };

      /**
       * Is the given string a member of this set?
       *
       * @param String aStr
       */
      ArraySet.prototype.has = function ArraySet_has(aStr) {
        if (hasNativeMap) {
          return this._set.has(aStr);
        } else {
          var sStr = util.toSetString(aStr);
          return has.call(this._set, sStr);
        }
      };

      /**
       * What is the index of the given string in the array?
       *
       * @param String aStr
       */
      ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
        if (hasNativeMap) {
          var idx = this._set.get(aStr);
          if (idx >= 0) {
            return idx;
          }
        } else {
          var sStr = util.toSetString(aStr);
          if (has.call(this._set, sStr)) {
            return this._set[sStr];
          }
        }

        throw new Error('"' + aStr + '" is not in the set.');
      };

      /**
       * What is the element at the given index?
       *
       * @param Number aIdx
       */
      ArraySet.prototype.at = function ArraySet_at(aIdx) {
        if (aIdx >= 0 && aIdx < this._array.length) {
          return this._array[aIdx];
        }
        throw new Error('No element indexed by ' + aIdx);
      };

      /**
       * Returns the array representation of this set (which has the proper indices
       * indicated by indexOf). Note that this is a copy of the internal array used
       * for storing the members so that no one can mess with internal state.
       */
      ArraySet.prototype.toArray = function ArraySet_toArray() {
        return this._array.slice();
      };

      exports.ArraySet = ArraySet;

    }, { "./util": 57 }],
    49: [function (require, module, exports) {
      /* -*- Mode: js; js-indent-level: 2; -*- */
      /*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 *
 * Based on the Base 64 VLQ implementation in Closure Compiler:
 * https://code.google.com/p/closure-compiler/source/browse/trunk/src/com/google/debugging/sourcemap/Base64VLQ.java
 *
 * Copyright 2011 The Closure Compiler Authors. All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *  * Redistributions of source code must retain the above copyright
 *    notice, this list of conditions and the following disclaimer.
 *  * Redistributions in binary form must reproduce the above
 *    copyright notice, this list of conditions and the following
 *    disclaimer in the documentation and/or other materials provided
 *    with the distribution.
 *  * Neither the name of Google Inc. nor the names of its
 *    contributors may be used to endorse or promote products derived
 *    from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

      var base64 = require('./base64');

// A single base 64 digit can contain 6 bits of data. For the base 64 variable
// length quantities we use in the source map spec, the first bit is the sign,
// the next four bits are the actual value, and the 6th bit is the
// continuation bit. The continuation bit tells us whether there are more
// digits in this value following this digit.
//
//   Continuation
//   |    Sign
//   |    |
//   V    V
//   101011

      var VLQ_BASE_SHIFT = 5;

// binary: 100000
      var VLQ_BASE = 1 << VLQ_BASE_SHIFT;

// binary: 011111
      var VLQ_BASE_MASK = VLQ_BASE - 1;

// binary: 100000
      var VLQ_CONTINUATION_BIT = VLQ_BASE;

      /**
       * Converts from a two-complement value to a value where the sign bit is
       * placed in the least significant bit.  For example, as decimals:
       *   1 becomes 2 (10 binary), -1 becomes 3 (11 binary)
       *   2 becomes 4 (100 binary), -2 becomes 5 (101 binary)
       */
      function toVLQSigned(aValue) {
        return aValue < 0
          ? ((-aValue) << 1) + 1
          : (aValue << 1) + 0;
      }

      /**
       * Converts to a two-complement value from a value where the sign bit is
       * placed in the least significant bit.  For example, as decimals:
       *   2 (10 binary) becomes 1, 3 (11 binary) becomes -1
       *   4 (100 binary) becomes 2, 5 (101 binary) becomes -2
       */
      function fromVLQSigned(aValue) {
        var isNegative = (aValue & 1) === 1;
        var shifted = aValue >> 1;
        return isNegative
          ? -shifted
          : shifted;
      }

      /**
       * Returns the base 64 VLQ encoded value.
       */
      exports.encode = function base64VLQ_encode(aValue) {
        var encoded = "";
        var digit;

        var vlq = toVLQSigned(aValue);

        do {
          digit = vlq & VLQ_BASE_MASK;
          vlq >>>= VLQ_BASE_SHIFT;
          if (vlq > 0) {
            // There are still more digits in this value, so we must make sure the
            // continuation bit is marked.
            digit |= VLQ_CONTINUATION_BIT;
          }
          encoded += base64.encode(digit);
        } while (vlq > 0);

        return encoded;
      };

      /**
       * Decodes the next base 64 VLQ value from the given string and returns the
       * value and the rest of the string via the out parameter.
       */
      exports.decode = function base64VLQ_decode(aStr, aIndex, aOutParam) {
        var strLen = aStr.length;
        var result = 0;
        var shift = 0;
        var continuation, digit;

        do {
          if (aIndex >= strLen) {
            throw new Error("Expected more digits in base 64 VLQ value.");
          }

          digit = base64.decode(aStr.charCodeAt(aIndex++));
          if (digit === -1) {
            throw new Error("Invalid base64 digit: " + aStr.charAt(aIndex - 1));
          }

          continuation = !!(digit & VLQ_CONTINUATION_BIT);
          digit &= VLQ_BASE_MASK;
          result = result + (digit << shift);
          shift += VLQ_BASE_SHIFT;
        } while (continuation);

        aOutParam.value = fromVLQSigned(result);
        aOutParam.rest = aIndex;
      };

    }, { "./base64": 50 }],
    50: [function (require, module, exports) {
      /* -*- Mode: js; js-indent-level: 2; -*- */
      /*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

      var intToCharMap = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('');

      /**
       * Encode an integer in the range of 0 to 63 to a single base 64 digit.
       */
      exports.encode = function (number) {
        if (0 <= number && number < intToCharMap.length) {
          return intToCharMap[number];
        }
        throw new TypeError("Must be between 0 and 63: " + number);
      };

      /**
       * Decode a single base 64 character code digit to an integer. Returns -1 on
       * failure.
       */
      exports.decode = function (charCode) {
        var bigA = 65;     // 'A'
        var bigZ = 90;     // 'Z'

        var littleA = 97;  // 'a'
        var littleZ = 122; // 'z'

        var zero = 48;     // '0'
        var nine = 57;     // '9'

        var plus = 43;     // '+'
        var slash = 47;    // '/'

        var littleOffset = 26;
        var numberOffset = 52;

        // 0 - 25: ABCDEFGHIJKLMNOPQRSTUVWXYZ
        if (bigA <= charCode && charCode <= bigZ) {
          return (charCode - bigA);
        }

        // 26 - 51: abcdefghijklmnopqrstuvwxyz
        if (littleA <= charCode && charCode <= littleZ) {
          return (charCode - littleA + littleOffset);
        }

        // 52 - 61: 0123456789
        if (zero <= charCode && charCode <= nine) {
          return (charCode - zero + numberOffset);
        }

        // 62: +
        if (charCode == plus) {
          return 62;
        }

        // 63: /
        if (charCode == slash) {
          return 63;
        }

        // Invalid base64 digit.
        return -1;
      };

    }, {}],
    51: [function (require, module, exports) {
      /* -*- Mode: js; js-indent-level: 2; -*- */
      /*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

      exports.GREATEST_LOWER_BOUND = 1;
      exports.LEAST_UPPER_BOUND = 2;

      /**
       * Recursive implementation of binary search.
       *
       * @param aLow Indices here and lower do not contain the needle.
       * @param aHigh Indices here and higher do not contain the needle.
       * @param aNeedle The element being searched for.
       * @param aHaystack The non-empty array being searched.
       * @param aCompare Function which takes two elements and returns -1, 0, or 1.
       * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
       *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
       *     closest element that is smaller than or greater than the one we are
       *     searching for, respectively, if the exact element cannot be found.
       */
      function recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare, aBias) {
        // This function terminates when one of the following is true:
        //
        //   1. We find the exact element we are looking for.
        //
        //   2. We did not find the exact element, but we can return the index of
        //      the next-closest element.
        //
        //   3. We did not find the exact element, and there is no next-closest
        //      element than the one we are searching for, so we return -1.
        var mid = Math.floor((aHigh - aLow) / 2) + aLow;
        var cmp = aCompare(aNeedle, aHaystack[mid], true);
        if (cmp === 0) {
          // Found the element we are looking for.
          return mid;
        }
        else if (cmp > 0) {
          // Our needle is greater than aHaystack[mid].
          if (aHigh - mid > 1) {
            // The element is in the upper half.
            return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare, aBias);
          }

          // The exact needle element was not found in this haystack. Determine if
          // we are in termination case (3) or (2) and return the appropriate thing.
          if (aBias == exports.LEAST_UPPER_BOUND) {
            return aHigh < aHaystack.length ? aHigh : -1;
          } else {
            return mid;
          }
        }
        else {
          // Our needle is less than aHaystack[mid].
          if (mid - aLow > 1) {
            // The element is in the lower half.
            return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare, aBias);
          }

          // we are in termination case (3) or (2) and return the appropriate thing.
          if (aBias == exports.LEAST_UPPER_BOUND) {
            return mid;
          } else {
            return aLow < 0 ? -1 : aLow;
          }
        }
      }

      /**
       * This is an implementation of binary search which will always try and return
       * the index of the closest element if there is no exact hit. This is because
       * mappings between original and generated line/col pairs are single points,
       * and there is an implicit region between each of them, so a miss just means
       * that you aren't on the very start of a region.
       *
       * @param aNeedle The element you are looking for.
       * @param aHaystack The array that is being searched.
       * @param aCompare A function which takes the needle and an element in the
       *     array and returns -1, 0, or 1 depending on whether the needle is less
       *     than, equal to, or greater than the element, respectively.
       * @param aBias Either 'binarySearch.GREATEST_LOWER_BOUND' or
       *     'binarySearch.LEAST_UPPER_BOUND'. Specifies whether to return the
       *     closest element that is smaller than or greater than the one we are
       *     searching for, respectively, if the exact element cannot be found.
       *     Defaults to 'binarySearch.GREATEST_LOWER_BOUND'.
       */
      exports.search = function search(aNeedle, aHaystack, aCompare, aBias) {
        if (aHaystack.length === 0) {
          return -1;
        }

        var index = recursiveSearch(-1, aHaystack.length, aNeedle, aHaystack,
          aCompare, aBias || exports.GREATEST_LOWER_BOUND);
        if (index < 0) {
          return -1;
        }

        // We have found either the exact element, or the next-closest element than
        // the one we are searching for. However, there may be more than one such
        // element. Make sure we always return the smallest of these.
        while (index - 1 >= 0) {
          if (aCompare(aHaystack[index], aHaystack[index - 1], true) !== 0) {
            break;
          }
          --index;
        }

        return index;
      };

    }, {}],
    52: [function (require, module, exports) {
      /* -*- Mode: js; js-indent-level: 2; -*- */
      /*
 * Copyright 2014 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

      var util = require('./util');

      /**
       * Determine whether mappingB is after mappingA with respect to generated
       * position.
       */
      function generatedPositionAfter(mappingA, mappingB) {
        // Optimized for most common case
        var lineA = mappingA.generatedLine;
        var lineB = mappingB.generatedLine;
        var columnA = mappingA.generatedColumn;
        var columnB = mappingB.generatedColumn;
        return lineB > lineA || lineB == lineA && columnB >= columnA ||
          util.compareByGeneratedPositionsInflated(mappingA, mappingB) <= 0;
      }

      /**
       * A data structure to provide a sorted view of accumulated mappings in a
       * performance conscious manner. It trades a neglibable overhead in general
       * case for a large speedup in case of mappings being added in order.
       */
      function MappingList() {
        this._array = [];
        this._sorted = true;
        // Serves as infimum
        this._last = { generatedLine: -1, generatedColumn: 0 };
      }

      /**
       * Iterate through internal items. This method takes the same arguments that
       * `Array.prototype.forEach` takes.
       *
       * NOTE: The order of the mappings is NOT guaranteed.
       */
      MappingList.prototype.unsortedForEach =
        function MappingList_forEach(aCallback, aThisArg) {
          this._array.forEach(aCallback, aThisArg);
        };

      /**
       * Add the given source mapping.
       *
       * @param Object aMapping
       */
      MappingList.prototype.add = function MappingList_add(aMapping) {
        if (generatedPositionAfter(this._last, aMapping)) {
          this._last = aMapping;
          this._array.push(aMapping);
        } else {
          this._sorted = false;
          this._array.push(aMapping);
        }
      };

      /**
       * Returns the flat, sorted array of mappings. The mappings are sorted by
       * generated position.
       *
       * WARNING: This method returns internal data without copying, for
       * performance. The return value must NOT be mutated, and should be treated as
       * an immutable borrow. If you want to take ownership, you must make your own
       * copy.
       */
      MappingList.prototype.toArray = function MappingList_toArray() {
        if (!this._sorted) {
          this._array.sort(util.compareByGeneratedPositionsInflated);
          this._sorted = true;
        }
        return this._array;
      };

      exports.MappingList = MappingList;

    }, { "./util": 57 }],
    53: [function (require, module, exports) {
      /* -*- Mode: js; js-indent-level: 2; -*- */
      /*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

// It turns out that some (most?) JavaScript engines don't self-host
// `Array.prototype.sort`. This makes sense because C++ will likely remain
// faster than JS when doing raw CPU-intensive sorting. However, when using a
// custom comparator function, calling back and forth between the VM's C++ and
// JIT'd JS is rather slow *and* loses JIT type information, resulting in
// worse generated code for the comparator function than would be optimal. In
// fact, when sorting with a comparator, these costs outweigh the benefits of
// sorting in C++. By using our own JS-implemented Quick Sort (below), we get
// a ~3500ms mean speed-up in `bench/bench.html`.

      /**
       * Swap the elements indexed by `x` and `y` in the array `ary`.
       *
       * @param {Array} ary
       *        The array.
       * @param {Number} x
       *        The index of the first item.
       * @param {Number} y
       *        The index of the second item.
       */
      function swap(ary, x, y) {
        var temp = ary[x];
        ary[x] = ary[y];
        ary[y] = temp;
      }

      /**
       * Returns a random integer within the range `low .. high` inclusive.
       *
       * @param {Number} low
       *        The lower bound on the range.
       * @param {Number} high
       *        The upper bound on the range.
       */
      function randomIntInRange(low, high) {
        return Math.round(low + (Math.random() * (high - low)));
      }

      /**
       * The Quick Sort algorithm.
       *
       * @param {Array} ary
       *        An array to sort.
       * @param {function} comparator
       *        Function to use to compare two items.
       * @param {Number} p
       *        Start index of the array
       * @param {Number} r
       *        End index of the array
       */
      function doQuickSort(ary, comparator, p, r) {
        // If our lower bound is less than our upper bound, we (1) partition the
        // array into two pieces and (2) recurse on each half. If it is not, this is
        // the empty array and our base case.

        if (p < r) {
          // (1) Partitioning.
          //
          // The partitioning chooses a pivot between `p` and `r` and moves all
          // elements that are less than or equal to the pivot to the before it, and
          // all the elements that are greater than it after it. The effect is that
          // once partition is done, the pivot is in the exact place it will be when
          // the array is put in sorted order, and it will not need to be moved
          // again. This runs in O(n) time.

          // Always choose a random pivot so that an input array which is reverse
          // sorted does not cause O(n^2) running time.
          var pivotIndex = randomIntInRange(p, r);
          var i = p - 1;

          swap(ary, pivotIndex, r);
          var pivot = ary[r];

          // Immediately after `j` is incremented in this loop, the following hold
          // true:
          //
          //   * Every element in `ary[p .. i]` is less than or equal to the pivot.
          //
          //   * Every element in `ary[i+1 .. j-1]` is greater than the pivot.
          for (var j = p; j < r; j++) {
            if (comparator(ary[j], pivot) <= 0) {
              i += 1;
              swap(ary, i, j);
            }
          }

          swap(ary, i + 1, j);
          var q = i + 1;

          // (2) Recurse on each half.

          doQuickSort(ary, comparator, p, q - 1);
          doQuickSort(ary, comparator, q + 1, r);
        }
      }

      /**
       * Sort the given array in-place with the given comparator function.
       *
       * @param {Array} ary
       *        An array to sort.
       * @param {function} comparator
       *        Function to use to compare two items.
       */
      exports.quickSort = function (ary, comparator) {
        doQuickSort(ary, comparator, 0, ary.length - 1);
      };

    }, {}],
    54: [function (require, module, exports) {
      /* -*- Mode: js; js-indent-level: 2; -*- */
      /*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

      var util = require('./util');
      var binarySearch = require('./binary-search');
      var ArraySet = require('./array-set').ArraySet;
      var base64VLQ = require('./base64-vlq');
      var quickSort = require('./quick-sort').quickSort;

      function SourceMapConsumer(aSourceMap, aSourceMapURL) {
        var sourceMap = aSourceMap;
        if (typeof aSourceMap === 'string') {
          sourceMap = util.parseSourceMapInput(aSourceMap);
        }

        return sourceMap.sections != null
          ? new IndexedSourceMapConsumer(sourceMap, aSourceMapURL)
          : new BasicSourceMapConsumer(sourceMap, aSourceMapURL);
      }

      SourceMapConsumer.fromSourceMap = function (aSourceMap, aSourceMapURL) {
        return BasicSourceMapConsumer.fromSourceMap(aSourceMap, aSourceMapURL);
      }

      /**
       * The version of the source mapping spec that we are consuming.
       */
      SourceMapConsumer.prototype._version = 3;

// `__generatedMappings` and `__originalMappings` are arrays that hold the
// parsed mapping coordinates from the source map's "mappings" attribute. They
// are lazily instantiated, accessed via the `_generatedMappings` and
// `_originalMappings` getters respectively, and we only parse the mappings
// and create these arrays once queried for a source location. We jump through
// these hoops because there can be many thousands of mappings, and parsing
// them is expensive, so we only want to do it if we must.
//
// Each object in the arrays is of the form:
//
//     {
//       generatedLine: The line number in the generated code,
//       generatedColumn: The column number in the generated code,
//       source: The path to the original source file that generated this
//               chunk of code,
//       originalLine: The line number in the original source that
//                     corresponds to this chunk of generated code,
//       originalColumn: The column number in the original source that
//                       corresponds to this chunk of generated code,
//       name: The name of the original symbol which generated this chunk of
//             code.
//     }
//
// All properties except for `generatedLine` and `generatedColumn` can be
// `null`.
//
// `_generatedMappings` is ordered by the generated positions.
//
// `_originalMappings` is ordered by the original positions.

      SourceMapConsumer.prototype.__generatedMappings = null;
      Object.defineProperty(SourceMapConsumer.prototype, '_generatedMappings', {
        configurable: true,
        enumerable: true,
        get: function () {
          if (!this.__generatedMappings) {
            this._parseMappings(this._mappings, this.sourceRoot);
          }

          return this.__generatedMappings;
        }
      });

      SourceMapConsumer.prototype.__originalMappings = null;
      Object.defineProperty(SourceMapConsumer.prototype, '_originalMappings', {
        configurable: true,
        enumerable: true,
        get: function () {
          if (!this.__originalMappings) {
            this._parseMappings(this._mappings, this.sourceRoot);
          }

          return this.__originalMappings;
        }
      });

      SourceMapConsumer.prototype._charIsMappingSeparator =
        function SourceMapConsumer_charIsMappingSeparator(aStr, index) {
          var c = aStr.charAt(index);
          return c === ";" || c === ",";
        };

      /**
       * Parse the mappings in a string in to a data structure which we can easily
       * query (the ordered arrays in the `this.__generatedMappings` and
       * `this.__originalMappings` properties).
       */
      SourceMapConsumer.prototype._parseMappings =
        function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
          throw new Error("Subclasses must implement _parseMappings");
        };

      SourceMapConsumer.GENERATED_ORDER = 1;
      SourceMapConsumer.ORIGINAL_ORDER = 2;

      SourceMapConsumer.GREATEST_LOWER_BOUND = 1;
      SourceMapConsumer.LEAST_UPPER_BOUND = 2;

      /**
       * Iterate over each mapping between an original source/line/column and a
       * generated line/column in this source map.
       *
       * @param Function aCallback
       *        The function that is called with each mapping.
       * @param Object aContext
       *        Optional. If specified, this object will be the value of `this` every
       *        time that `aCallback` is called.
       * @param aOrder
       *        Either `SourceMapConsumer.GENERATED_ORDER` or
       *        `SourceMapConsumer.ORIGINAL_ORDER`. Specifies whether you want to
       *        iterate over the mappings sorted by the generated file's line/column
       *        order or the original's source/line/column order, respectively. Defaults to
       *        `SourceMapConsumer.GENERATED_ORDER`.
       */
      SourceMapConsumer.prototype.eachMapping =
        function SourceMapConsumer_eachMapping(aCallback, aContext, aOrder) {
          var context = aContext || null;
          var order = aOrder || SourceMapConsumer.GENERATED_ORDER;

          var mappings;
          switch (order) {
            case SourceMapConsumer.GENERATED_ORDER:
              mappings = this._generatedMappings;
              break;
            case SourceMapConsumer.ORIGINAL_ORDER:
              mappings = this._originalMappings;
              break;
            default:
              throw new Error("Unknown order of iteration.");
          }

          var sourceRoot = this.sourceRoot;
          mappings.map(function (mapping) {
            var source = mapping.source === null ? null : this._sources.at(mapping.source);
            source = util.computeSourceURL(sourceRoot, source, this._sourceMapURL);
            return {
              source: source,
              generatedLine: mapping.generatedLine,
              generatedColumn: mapping.generatedColumn,
              originalLine: mapping.originalLine,
              originalColumn: mapping.originalColumn,
              name: mapping.name === null ? null : this._names.at(mapping.name)
            };
          }, this).forEach(aCallback, context);
        };

      /**
       * Returns all generated line and column information for the original source,
       * line, and column provided. If no column is provided, returns all mappings
       * corresponding to a either the line we are searching for or the next
       * closest line that has any mappings. Otherwise, returns all mappings
       * corresponding to the given line and either the column we are searching for
       * or the next closest column that has any offsets.
       *
       * The only argument is an object with the following properties:
       *
       *   - source: The filename of the original source.
       *   - line: The line number in the original source.  The line number is 1-based.
       *   - column: Optional. the column number in the original source.
       *    The column number is 0-based.
       *
       * and an array of objects is returned, each with the following properties:
       *
       *   - line: The line number in the generated source, or null.  The
       *    line number is 1-based.
       *   - column: The column number in the generated source, or null.
       *    The column number is 0-based.
       */
      SourceMapConsumer.prototype.allGeneratedPositionsFor =
        function SourceMapConsumer_allGeneratedPositionsFor(aArgs) {
          var line = util.getArg(aArgs, 'line');

          // When there is no exact match, BasicSourceMapConsumer.prototype._findMapping
          // returns the index of the closest mapping less than the needle. By
          // setting needle.originalColumn to 0, we thus find the last mapping for
          // the given line, provided such a mapping exists.
          var needle = {
            source: util.getArg(aArgs, 'source'),
            originalLine: line,
            originalColumn: util.getArg(aArgs, 'column', 0)
          };

          needle.source = this._findSourceIndex(needle.source);
          if (needle.source < 0) {
            return [];
          }

          var mappings = [];

          var index = this._findMapping(needle,
            this._originalMappings,
            "originalLine",
            "originalColumn",
            util.compareByOriginalPositions,
            binarySearch.LEAST_UPPER_BOUND);
          if (index >= 0) {
            var mapping = this._originalMappings[index];

            if (aArgs.column === undefined) {
              var originalLine = mapping.originalLine;

              // Iterate until either we run out of mappings, or we run into
              // a mapping for a different line than the one we found. Since
              // mappings are sorted, this is guaranteed to find all mappings for
              // the line we found.
              while (mapping && mapping.originalLine === originalLine) {
                mappings.push({
                  line: util.getArg(mapping, 'generatedLine', null),
                  column: util.getArg(mapping, 'generatedColumn', null),
                  lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
                });

                mapping = this._originalMappings[++index];
              }
            } else {
              var originalColumn = mapping.originalColumn;

              // Iterate until either we run out of mappings, or we run into
              // a mapping for a different line than the one we were searching for.
              // Since mappings are sorted, this is guaranteed to find all mappings for
              // the line we are searching for.
              while (mapping &&
              mapping.originalLine === line &&
              mapping.originalColumn == originalColumn)
              {
                mappings.push({
                  line: util.getArg(mapping, 'generatedLine', null),
                  column: util.getArg(mapping, 'generatedColumn', null),
                  lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
                });

                mapping = this._originalMappings[++index];
              }
            }
          }

          return mappings;
        };

      exports.SourceMapConsumer = SourceMapConsumer;

      /**
       * A BasicSourceMapConsumer instance represents a parsed source map which we can
       * query for information about the original file positions by giving it a file
       * position in the generated source.
       *
       * The first parameter is the raw source map (either as a JSON string, or
       * already parsed to an object). According to the spec, source maps have the
       * following attributes:
       *
       *   - version: Which version of the source map spec this map is following.
       *   - sources: An array of URLs to the original source files.
       *   - names: An array of identifiers which can be referrenced by individual mappings.
       *   - sourceRoot: Optional. The URL root from which all sources are relative.
       *   - sourcesContent: Optional. An array of contents of the original source files.
       *   - mappings: A string of base64 VLQs which contain the actual mappings.
       *   - file: Optional. The generated file this source map is associated with.
       *
       * Here is an example source map, taken from the source map spec[0]:
       *
       *     {
       *       version : 3,
       *       file: "out.js",
       *       sourceRoot : "",
       *       sources: ["foo.js", "bar.js"],
       *       names: ["src", "maps", "are", "fun"],
       *       mappings: "AA,AB;;ABCDE;"
       *     }
       *
       * The second parameter, if given, is a string whose value is the URL
       * at which the source map was found.  This URL is used to compute the
       * sources array.
       *
       * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit?pli=1#
       */
      function BasicSourceMapConsumer(aSourceMap, aSourceMapURL) {
        var sourceMap = aSourceMap;
        if (typeof aSourceMap === 'string') {
          sourceMap = util.parseSourceMapInput(aSourceMap);
        }

        var version = util.getArg(sourceMap, 'version');
        var sources = util.getArg(sourceMap, 'sources');
        // Sass 3.3 leaves out the 'names' array, so we deviate from the spec (which
        // requires the array) to play nice here.
        var names = util.getArg(sourceMap, 'names', []);
        var sourceRoot = util.getArg(sourceMap, 'sourceRoot', null);
        var sourcesContent = util.getArg(sourceMap, 'sourcesContent', null);
        var mappings = util.getArg(sourceMap, 'mappings');
        var file = util.getArg(sourceMap, 'file', null);

        // Once again, Sass deviates from the spec and supplies the version as a
        // string rather than a number, so we use loose equality checking here.
        if (version != this._version) {
          throw new Error('Unsupported version: ' + version);
        }

        if (sourceRoot) {
          sourceRoot = util.normalize(sourceRoot);
        }

        sources = sources
          .map(String)
          // Some source maps produce relative source paths like "./foo.js" instead of
          // "foo.js".  Normalize these first so that future comparisons will succeed.
          // See bugzil.la/1090768.
          .map(util.normalize)
          // Always ensure that absolute sources are internally stored relative to
          // the source root, if the source root is absolute. Not doing this would
          // be particularly problematic when the source root is a prefix of the
          // source (valid, but why??). See github issue #199 and bugzil.la/1188982.
          .map(function (source) {
            return sourceRoot && util.isAbsolute(sourceRoot) && util.isAbsolute(source)
              ? util.relative(sourceRoot, source)
              : source;
          });

        // Pass `true` below to allow duplicate names and sources. While source maps
        // are intended to be compressed and deduplicated, the TypeScript compiler
        // sometimes generates source maps with duplicates in them. See Github issue
        // #72 and bugzil.la/889492.
        this._names = ArraySet.fromArray(names.map(String), true);
        this._sources = ArraySet.fromArray(sources, true);

        this._absoluteSources = this._sources.toArray().map(function (s) {
          return util.computeSourceURL(sourceRoot, s, aSourceMapURL);
        });

        this.sourceRoot = sourceRoot;
        this.sourcesContent = sourcesContent;
        this._mappings = mappings;
        this._sourceMapURL = aSourceMapURL;
        this.file = file;
      }

      BasicSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
      BasicSourceMapConsumer.prototype.consumer = SourceMapConsumer;

      /**
       * Utility function to find the index of a source.  Returns -1 if not
       * found.
       */
      BasicSourceMapConsumer.prototype._findSourceIndex = function (aSource) {
        var relativeSource = aSource;
        if (this.sourceRoot != null) {
          relativeSource = util.relative(this.sourceRoot, relativeSource);
        }

        if (this._sources.has(relativeSource)) {
          return this._sources.indexOf(relativeSource);
        }

        // Maybe aSource is an absolute URL as returned by |sources|.  In
        // this case we can't simply undo the transform.
        var i;
        for (i = 0; i < this._absoluteSources.length; ++i) {
          if (this._absoluteSources[i] == aSource) {
            return i;
          }
        }

        return -1;
      };

      /**
       * Create a BasicSourceMapConsumer from a SourceMapGenerator.
       *
       * @param SourceMapGenerator aSourceMap
       *        The source map that will be consumed.
       * @param String aSourceMapURL
       *        The URL at which the source map can be found (optional)
       * @returns BasicSourceMapConsumer
       */
      BasicSourceMapConsumer.fromSourceMap =
        function SourceMapConsumer_fromSourceMap(aSourceMap, aSourceMapURL) {
          var smc = Object.create(BasicSourceMapConsumer.prototype);

          var names = smc._names = ArraySet.fromArray(aSourceMap._names.toArray(), true);
          var sources = smc._sources = ArraySet.fromArray(aSourceMap._sources.toArray(), true);
          smc.sourceRoot = aSourceMap._sourceRoot;
          smc.sourcesContent = aSourceMap._generateSourcesContent(smc._sources.toArray(),
            smc.sourceRoot);
          smc.file = aSourceMap._file;
          smc._sourceMapURL = aSourceMapURL;
          smc._absoluteSources = smc._sources.toArray().map(function (s) {
            return util.computeSourceURL(smc.sourceRoot, s, aSourceMapURL);
          });

          // Because we are modifying the entries (by converting string sources and
          // names to indices into the sources and names ArraySets), we have to make
          // a copy of the entry or else bad things happen. Shared mutable state
          // strikes again! See github issue #191.

          var generatedMappings = aSourceMap._mappings.toArray().slice();
          var destGeneratedMappings = smc.__generatedMappings = [];
          var destOriginalMappings = smc.__originalMappings = [];

          for (var i = 0, length = generatedMappings.length; i < length; i++) {
            var srcMapping = generatedMappings[i];
            var destMapping = new Mapping;
            destMapping.generatedLine = srcMapping.generatedLine;
            destMapping.generatedColumn = srcMapping.generatedColumn;

            if (srcMapping.source) {
              destMapping.source = sources.indexOf(srcMapping.source);
              destMapping.originalLine = srcMapping.originalLine;
              destMapping.originalColumn = srcMapping.originalColumn;

              if (srcMapping.name) {
                destMapping.name = names.indexOf(srcMapping.name);
              }

              destOriginalMappings.push(destMapping);
            }

            destGeneratedMappings.push(destMapping);
          }

          quickSort(smc.__originalMappings, util.compareByOriginalPositions);

          return smc;
        };

      /**
       * The version of the source mapping spec that we are consuming.
       */
      BasicSourceMapConsumer.prototype._version = 3;

      /**
       * The list of original sources.
       */
      Object.defineProperty(BasicSourceMapConsumer.prototype, 'sources', {
        get: function () {
          return this._absoluteSources.slice();
        }
      });

      /**
       * Provide the JIT with a nice shape / hidden class.
       */
      function Mapping() {
        this.generatedLine = 0;
        this.generatedColumn = 0;
        this.source = null;
        this.originalLine = null;
        this.originalColumn = null;
        this.name = null;
      }

      /**
       * Parse the mappings in a string in to a data structure which we can easily
       * query (the ordered arrays in the `this.__generatedMappings` and
       * `this.__originalMappings` properties).
       */
      BasicSourceMapConsumer.prototype._parseMappings =
        function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
          var generatedLine = 1;
          var previousGeneratedColumn = 0;
          var previousOriginalLine = 0;
          var previousOriginalColumn = 0;
          var previousSource = 0;
          var previousName = 0;
          var length = aStr.length;
          var index = 0;
          var cachedSegments = {};
          var temp = {};
          var originalMappings = [];
          var generatedMappings = [];
          var mapping, str, segment, end, value;

          while (index < length) {
            if (aStr.charAt(index) === ';') {
              generatedLine++;
              index++;
              previousGeneratedColumn = 0;
            }
            else if (aStr.charAt(index) === ',') {
              index++;
            }
            else {
              mapping = new Mapping();
              mapping.generatedLine = generatedLine;

              // Because each offset is encoded relative to the previous one,
              // many segments often have the same encoding. We can exploit this
              // fact by caching the parsed variable length fields of each segment,
              // allowing us to avoid a second parse if we encounter the same
              // segment again.
              for (end = index; end < length; end++) {
                if (this._charIsMappingSeparator(aStr, end)) {
                  break;
                }
              }
              str = aStr.slice(index, end);

              segment = cachedSegments[str];
              if (segment) {
                index += str.length;
              } else {
                segment = [];
                while (index < end) {
                  base64VLQ.decode(aStr, index, temp);
                  value = temp.value;
                  index = temp.rest;
                  segment.push(value);
                }

                if (segment.length === 2) {
                  throw new Error('Found a source, but no line and column');
                }

                if (segment.length === 3) {
                  throw new Error('Found a source and line, but no column');
                }

                cachedSegments[str] = segment;
              }

              // Generated column.
              mapping.generatedColumn = previousGeneratedColumn + segment[0];
              previousGeneratedColumn = mapping.generatedColumn;

              if (segment.length > 1) {
                // Original source.
                mapping.source = previousSource + segment[1];
                previousSource += segment[1];

                // Original line.
                mapping.originalLine = previousOriginalLine + segment[2];
                previousOriginalLine = mapping.originalLine;
                // Lines are stored 0-based
                mapping.originalLine += 1;

                // Original column.
                mapping.originalColumn = previousOriginalColumn + segment[3];
                previousOriginalColumn = mapping.originalColumn;

                if (segment.length > 4) {
                  // Original name.
                  mapping.name = previousName + segment[4];
                  previousName += segment[4];
                }
              }

              generatedMappings.push(mapping);
              if (typeof mapping.originalLine === 'number') {
                originalMappings.push(mapping);
              }
            }
          }

          quickSort(generatedMappings, util.compareByGeneratedPositionsDeflated);
          this.__generatedMappings = generatedMappings;

          quickSort(originalMappings, util.compareByOriginalPositions);
          this.__originalMappings = originalMappings;
        };

      /**
       * Find the mapping that best matches the hypothetical "needle" mapping that
       * we are searching for in the given "haystack" of mappings.
       */
      BasicSourceMapConsumer.prototype._findMapping =
        function SourceMapConsumer_findMapping(aNeedle, aMappings, aLineName,
                                               aColumnName, aComparator, aBias)
        {
          // To return the position we are searching for, we must first find the
          // mapping for the given position and then return the opposite position it
          // points to. Because the mappings are sorted, we can use binary search to
          // find the best mapping.

          if (aNeedle[aLineName] <= 0) {
            throw new TypeError('Line must be greater than or equal to 1, got '
              + aNeedle[aLineName]);
          }
          if (aNeedle[aColumnName] < 0) {
            throw new TypeError('Column must be greater than or equal to 0, got '
              + aNeedle[aColumnName]);
          }

          return binarySearch.search(aNeedle, aMappings, aComparator, aBias);
        };

      /**
       * Compute the last column for each generated mapping. The last column is
       * inclusive.
       */
      BasicSourceMapConsumer.prototype.computeColumnSpans =
        function SourceMapConsumer_computeColumnSpans() {
          for (var index = 0; index < this._generatedMappings.length; ++index) {
            var mapping = this._generatedMappings[index];

            // Mappings do not contain a field for the last generated columnt. We
            // can come up with an optimistic estimate, however, by assuming that
            // mappings are contiguous (i.e. given two consecutive mappings, the
            // first mapping ends where the second one starts).
            if (index + 1 < this._generatedMappings.length) {
              var nextMapping = this._generatedMappings[index + 1];

              if (mapping.generatedLine === nextMapping.generatedLine) {
                mapping.lastGeneratedColumn = nextMapping.generatedColumn - 1;
                continue;
              }
            }

            // The last mapping for each line spans the entire line.
            mapping.lastGeneratedColumn = Infinity;
          }
        };

      /**
       * Returns the original source, line, and column information for the generated
       * source's line and column positions provided. The only argument is an object
       * with the following properties:
       *
       *   - line: The line number in the generated source.  The line number
       *     is 1-based.
       *   - column: The column number in the generated source.  The column
       *     number is 0-based.
       *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
       *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
       *     closest element that is smaller than or greater than the one we are
       *     searching for, respectively, if the exact element cannot be found.
       *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
       *
       * and an object is returned with the following properties:
       *
       *   - source: The original source file, or null.
       *   - line: The line number in the original source, or null.  The
       *     line number is 1-based.
       *   - column: The column number in the original source, or null.  The
       *     column number is 0-based.
       *   - name: The original identifier, or null.
       */
      BasicSourceMapConsumer.prototype.originalPositionFor =
        function SourceMapConsumer_originalPositionFor(aArgs) {
          var needle = {
            generatedLine: util.getArg(aArgs, 'line'),
            generatedColumn: util.getArg(aArgs, 'column')
          };

          var index = this._findMapping(
            needle,
            this._generatedMappings,
            "generatedLine",
            "generatedColumn",
            util.compareByGeneratedPositionsDeflated,
            util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
          );

          if (index >= 0) {
            var mapping = this._generatedMappings[index];

            if (mapping.generatedLine === needle.generatedLine) {
              var source = util.getArg(mapping, 'source', null);
              if (source !== null) {
                source = this._sources.at(source);
                source = util.computeSourceURL(this.sourceRoot, source, this._sourceMapURL);
              }
              var name = util.getArg(mapping, 'name', null);
              if (name !== null) {
                name = this._names.at(name);
              }
              return {
                source: source,
                line: util.getArg(mapping, 'originalLine', null),
                column: util.getArg(mapping, 'originalColumn', null),
                name: name
              };
            }
          }

          return {
            source: null,
            line: null,
            column: null,
            name: null
          };
        };

      /**
       * Return true if we have the source content for every source in the source
       * map, false otherwise.
       */
      BasicSourceMapConsumer.prototype.hasContentsOfAllSources =
        function BasicSourceMapConsumer_hasContentsOfAllSources() {
          if (!this.sourcesContent) {
            return false;
          }
          return this.sourcesContent.length >= this._sources.size() &&
            !this.sourcesContent.some(function (sc) {
              return sc == null;
            });
        };

      /**
       * Returns the original source content. The only argument is the url of the
       * original source file. Returns null if no original source content is
       * available.
       */
      BasicSourceMapConsumer.prototype.sourceContentFor =
        function SourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
          if (!this.sourcesContent) {
            return null;
          }

          var index = this._findSourceIndex(aSource);
          if (index >= 0) {
            return this.sourcesContent[index];
          }

          var relativeSource = aSource;
          if (this.sourceRoot != null) {
            relativeSource = util.relative(this.sourceRoot, relativeSource);
          }

          var url;
          if (this.sourceRoot != null
            && (url = util.urlParse(this.sourceRoot)))
          {
            // XXX: file:// URIs and absolute paths lead to unexpected behavior for
            // many users. We can help them out when they expect file:// URIs to
            // behave like it would if they were running a local HTTP server. See
            // https://bugzilla.mozilla.org/show_bug.cgi?id=885597.
            var fileUriAbsPath = relativeSource.replace(/^file:\/\//, "");
            if (url.scheme == "file"
              && this._sources.has(fileUriAbsPath))
            {
              return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)]
            }

            if ((!url.path || url.path == "/")
              && this._sources.has("/" + relativeSource))
            {
              return this.sourcesContent[this._sources.indexOf("/" + relativeSource)];
            }
          }

          // This function is used recursively from
          // IndexedSourceMapConsumer.prototype.sourceContentFor. In that case, we
          // don't want to throw if we can't find the source - we just want to
          // return null, so we provide a flag to exit gracefully.
          if (nullOnMissing) {
            return null;
          }
          else {
            throw new Error('"' + relativeSource + '" is not in the SourceMap.');
          }
        };

      /**
       * Returns the generated line and column information for the original source,
       * line, and column positions provided. The only argument is an object with
       * the following properties:
       *
       *   - source: The filename of the original source.
       *   - line: The line number in the original source.  The line number
       *     is 1-based.
       *   - column: The column number in the original source.  The column
       *     number is 0-based.
       *   - bias: Either 'SourceMapConsumer.GREATEST_LOWER_BOUND' or
       *     'SourceMapConsumer.LEAST_UPPER_BOUND'. Specifies whether to return the
       *     closest element that is smaller than or greater than the one we are
       *     searching for, respectively, if the exact element cannot be found.
       *     Defaults to 'SourceMapConsumer.GREATEST_LOWER_BOUND'.
       *
       * and an object is returned with the following properties:
       *
       *   - line: The line number in the generated source, or null.  The
       *     line number is 1-based.
       *   - column: The column number in the generated source, or null.
       *     The column number is 0-based.
       */
      BasicSourceMapConsumer.prototype.generatedPositionFor =
        function SourceMapConsumer_generatedPositionFor(aArgs) {
          var source = util.getArg(aArgs, 'source');
          source = this._findSourceIndex(source);
          if (source < 0) {
            return {
              line: null,
              column: null,
              lastColumn: null
            };
          }

          var needle = {
            source: source,
            originalLine: util.getArg(aArgs, 'line'),
            originalColumn: util.getArg(aArgs, 'column')
          };

          var index = this._findMapping(
            needle,
            this._originalMappings,
            "originalLine",
            "originalColumn",
            util.compareByOriginalPositions,
            util.getArg(aArgs, 'bias', SourceMapConsumer.GREATEST_LOWER_BOUND)
          );

          if (index >= 0) {
            var mapping = this._originalMappings[index];

            if (mapping.source === needle.source) {
              return {
                line: util.getArg(mapping, 'generatedLine', null),
                column: util.getArg(mapping, 'generatedColumn', null),
                lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
              };
            }
          }

          return {
            line: null,
            column: null,
            lastColumn: null
          };
        };

      exports.BasicSourceMapConsumer = BasicSourceMapConsumer;

      /**
       * An IndexedSourceMapConsumer instance represents a parsed source map which
       * we can query for information. It differs from BasicSourceMapConsumer in
       * that it takes "indexed" source maps (i.e. ones with a "sections" field) as
       * input.
       *
       * The first parameter is a raw source map (either as a JSON string, or already
       * parsed to an object). According to the spec for indexed source maps, they
       * have the following attributes:
       *
       *   - version: Which version of the source map spec this map is following.
       *   - file: Optional. The generated file this source map is associated with.
       *   - sections: A list of section definitions.
       *
       * Each value under the "sections" field has two fields:
       *   - offset: The offset into the original specified at which this section
       *       begins to apply, defined as an object with a "line" and "column"
       *       field.
       *   - map: A source map definition. This source map could also be indexed,
       *       but doesn't have to be.
       *
       * Instead of the "map" field, it's also possible to have a "url" field
       * specifying a URL to retrieve a source map from, but that's currently
       * unsupported.
       *
       * Here's an example source map, taken from the source map spec[0], but
       * modified to omit a section which uses the "url" field.
       *
       *  {
       *    version : 3,
       *    file: "app.js",
       *    sections: [{
       *      offset: {line:100, column:10},
       *      map: {
       *        version : 3,
       *        file: "section.js",
       *        sources: ["foo.js", "bar.js"],
       *        names: ["src", "maps", "are", "fun"],
       *        mappings: "AAAA,E;;ABCDE;"
       *      }
       *    }],
       *  }
       *
       * The second parameter, if given, is a string whose value is the URL
       * at which the source map was found.  This URL is used to compute the
       * sources array.
       *
       * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit#heading=h.535es3xeprgt
       */
      function IndexedSourceMapConsumer(aSourceMap, aSourceMapURL) {
        var sourceMap = aSourceMap;
        if (typeof aSourceMap === 'string') {
          sourceMap = util.parseSourceMapInput(aSourceMap);
        }

        var version = util.getArg(sourceMap, 'version');
        var sections = util.getArg(sourceMap, 'sections');

        if (version != this._version) {
          throw new Error('Unsupported version: ' + version);
        }

        this._sources = new ArraySet();
        this._names = new ArraySet();

        var lastOffset = {
          line: -1,
          column: 0
        };
        this._sections = sections.map(function (s) {
          if (s.url) {
            // The url field will require support for asynchronicity.
            // See https://github.com/mozilla/source-map/issues/16
            throw new Error('Support for url field in sections not implemented.');
          }
          var offset = util.getArg(s, 'offset');
          var offsetLine = util.getArg(offset, 'line');
          var offsetColumn = util.getArg(offset, 'column');

          if (offsetLine < lastOffset.line ||
            (offsetLine === lastOffset.line && offsetColumn < lastOffset.column))
          {
            throw new Error('Section offsets must be ordered and non-overlapping.');
          }
          lastOffset = offset;

          return {
            generatedOffset: {
              // The offset fields are 0-based, but we use 1-based indices when
              // encoding/decoding from VLQ.
              generatedLine: offsetLine + 1,
              generatedColumn: offsetColumn + 1
            },
            consumer: new SourceMapConsumer(util.getArg(s, 'map'), aSourceMapURL)
          }
        });
      }

      IndexedSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
      IndexedSourceMapConsumer.prototype.constructor = SourceMapConsumer;

      /**
       * The version of the source mapping spec that we are consuming.
       */
      IndexedSourceMapConsumer.prototype._version = 3;

      /**
       * The list of original sources.
       */
      Object.defineProperty(IndexedSourceMapConsumer.prototype, 'sources', {
        get: function () {
          var sources = [];
          for (var i = 0; i < this._sections.length; i++) {
            for (var j = 0; j < this._sections[i].consumer.sources.length; j++) {
              sources.push(this._sections[i].consumer.sources[j]);
            }
          }
          return sources;
        }
      });

      /**
       * Returns the original source, line, and column information for the generated
       * source's line and column positions provided. The only argument is an object
       * with the following properties:
       *
       *   - line: The line number in the generated source.  The line number
       *     is 1-based.
       *   - column: The column number in the generated source.  The column
       *     number is 0-based.
       *
       * and an object is returned with the following properties:
       *
       *   - source: The original source file, or null.
       *   - line: The line number in the original source, or null.  The
       *     line number is 1-based.
       *   - column: The column number in the original source, or null.  The
       *     column number is 0-based.
       *   - name: The original identifier, or null.
       */
      IndexedSourceMapConsumer.prototype.originalPositionFor =
        function IndexedSourceMapConsumer_originalPositionFor(aArgs) {
          var needle = {
            generatedLine: util.getArg(aArgs, 'line'),
            generatedColumn: util.getArg(aArgs, 'column')
          };

          // Find the section containing the generated position we're trying to map
          // to an original position.
          var sectionIndex = binarySearch.search(needle, this._sections,
            function (needle, section) {
              var cmp = needle.generatedLine - section.generatedOffset.generatedLine;
              if (cmp) {
                return cmp;
              }

              return (needle.generatedColumn -
                section.generatedOffset.generatedColumn);
            });
          var section = this._sections[sectionIndex];

          if (!section) {
            return {
              source: null,
              line: null,
              column: null,
              name: null
            };
          }

          return section.consumer.originalPositionFor({
            line: needle.generatedLine -
              (section.generatedOffset.generatedLine - 1),
            column: needle.generatedColumn -
              (section.generatedOffset.generatedLine === needle.generatedLine
                ? section.generatedOffset.generatedColumn - 1
                : 0),
            bias: aArgs.bias
          });
        };

      /**
       * Return true if we have the source content for every source in the source
       * map, false otherwise.
       */
      IndexedSourceMapConsumer.prototype.hasContentsOfAllSources =
        function IndexedSourceMapConsumer_hasContentsOfAllSources() {
          return this._sections.every(function (s) {
            return s.consumer.hasContentsOfAllSources();
          });
        };

      /**
       * Returns the original source content. The only argument is the url of the
       * original source file. Returns null if no original source content is
       * available.
       */
      IndexedSourceMapConsumer.prototype.sourceContentFor =
        function IndexedSourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
          for (var i = 0; i < this._sections.length; i++) {
            var section = this._sections[i];

            var content = section.consumer.sourceContentFor(aSource, true);
            if (content) {
              return content;
            }
          }
          if (nullOnMissing) {
            return null;
          }
          else {
            throw new Error('"' + aSource + '" is not in the SourceMap.');
          }
        };

      /**
       * Returns the generated line and column information for the original source,
       * line, and column positions provided. The only argument is an object with
       * the following properties:
       *
       *   - source: The filename of the original source.
       *   - line: The line number in the original source.  The line number
       *     is 1-based.
       *   - column: The column number in the original source.  The column
       *     number is 0-based.
       *
       * and an object is returned with the following properties:
       *
       *   - line: The line number in the generated source, or null.  The
       *     line number is 1-based.
       *   - column: The column number in the generated source, or null.
       *     The column number is 0-based.
       */
      IndexedSourceMapConsumer.prototype.generatedPositionFor =
        function IndexedSourceMapConsumer_generatedPositionFor(aArgs) {
          for (var i = 0; i < this._sections.length; i++) {
            var section = this._sections[i];

            // Only consider this section if the requested source is in the list of
            // sources of the consumer.
            if (section.consumer._findSourceIndex(util.getArg(aArgs, 'source')) === -1) {
              continue;
            }
            var generatedPosition = section.consumer.generatedPositionFor(aArgs);
            if (generatedPosition) {
              var ret = {
                line: generatedPosition.line +
                  (section.generatedOffset.generatedLine - 1),
                column: generatedPosition.column +
                  (section.generatedOffset.generatedLine === generatedPosition.line
                    ? section.generatedOffset.generatedColumn - 1
                    : 0)
              };
              return ret;
            }
          }

          return {
            line: null,
            column: null
          };
        };

      /**
       * Parse the mappings in a string in to a data structure which we can easily
       * query (the ordered arrays in the `this.__generatedMappings` and
       * `this.__originalMappings` properties).
       */
      IndexedSourceMapConsumer.prototype._parseMappings =
        function IndexedSourceMapConsumer_parseMappings(aStr, aSourceRoot) {
          this.__generatedMappings = [];
          this.__originalMappings = [];
          for (var i = 0; i < this._sections.length; i++) {
            var section = this._sections[i];
            var sectionMappings = section.consumer._generatedMappings;
            for (var j = 0; j < sectionMappings.length; j++) {
              var mapping = sectionMappings[j];

              var source = section.consumer._sources.at(mapping.source);
              source = util.computeSourceURL(section.consumer.sourceRoot, source, this._sourceMapURL);
              this._sources.add(source);
              source = this._sources.indexOf(source);

              var name = null;
              if (mapping.name) {
                name = section.consumer._names.at(mapping.name);
                this._names.add(name);
                name = this._names.indexOf(name);
              }

              // The mappings coming from the consumer for the section have
              // generated positions relative to the start of the section, so we
              // need to offset them to be relative to the start of the concatenated
              // generated file.
              var adjustedMapping = {
                source: source,
                generatedLine: mapping.generatedLine +
                  (section.generatedOffset.generatedLine - 1),
                generatedColumn: mapping.generatedColumn +
                  (section.generatedOffset.generatedLine === mapping.generatedLine
                    ? section.generatedOffset.generatedColumn - 1
                    : 0),
                originalLine: mapping.originalLine,
                originalColumn: mapping.originalColumn,
                name: name
              };

              this.__generatedMappings.push(adjustedMapping);
              if (typeof adjustedMapping.originalLine === 'number') {
                this.__originalMappings.push(adjustedMapping);
              }
            }
          }

          quickSort(this.__generatedMappings, util.compareByGeneratedPositionsDeflated);
          quickSort(this.__originalMappings, util.compareByOriginalPositions);
        };

      exports.IndexedSourceMapConsumer = IndexedSourceMapConsumer;

    }, { "./array-set": 48, "./base64-vlq": 49, "./binary-search": 51, "./quick-sort": 53, "./util": 57 }],
    55: [function (require, module, exports) {
      /* -*- Mode: js; js-indent-level: 2; -*- */
      /*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

      var base64VLQ = require('./base64-vlq');
      var util = require('./util');
      var ArraySet = require('./array-set').ArraySet;
      var MappingList = require('./mapping-list').MappingList;

      /**
       * An instance of the SourceMapGenerator represents a source map which is
       * being built incrementally. You may pass an object with the following
       * properties:
       *
       *   - file: The filename of the generated source.
       *   - sourceRoot: A root for all relative URLs in this source map.
       */
      function SourceMapGenerator(aArgs) {
        if (!aArgs) {
          aArgs = {};
        }
        this._file = util.getArg(aArgs, 'file', null);
        this._sourceRoot = util.getArg(aArgs, 'sourceRoot', null);
        this._skipValidation = util.getArg(aArgs, 'skipValidation', false);
        this._sources = new ArraySet();
        this._names = new ArraySet();
        this._mappings = new MappingList();
        this._sourcesContents = null;
      }

      SourceMapGenerator.prototype._version = 3;

      /**
       * Creates a new SourceMapGenerator based on a SourceMapConsumer
       *
       * @param aSourceMapConsumer The SourceMap.
       */
      SourceMapGenerator.fromSourceMap =
        function SourceMapGenerator_fromSourceMap(aSourceMapConsumer) {
          var sourceRoot = aSourceMapConsumer.sourceRoot;
          var generator = new SourceMapGenerator({
            file: aSourceMapConsumer.file,
            sourceRoot: sourceRoot
          });
          aSourceMapConsumer.eachMapping(function (mapping) {
            var newMapping = {
              generated: {
                line: mapping.generatedLine,
                column: mapping.generatedColumn
              }
            };

            if (mapping.source != null) {
              newMapping.source = mapping.source;
              if (sourceRoot != null) {
                newMapping.source = util.relative(sourceRoot, newMapping.source);
              }

              newMapping.original = {
                line: mapping.originalLine,
                column: mapping.originalColumn
              };

              if (mapping.name != null) {
                newMapping.name = mapping.name;
              }
            }

            generator.addMapping(newMapping);
          });
          aSourceMapConsumer.sources.forEach(function (sourceFile) {
            var sourceRelative = sourceFile;
            if (sourceRoot !== null) {
              sourceRelative = util.relative(sourceRoot, sourceFile);
            }

            if (!generator._sources.has(sourceRelative)) {
              generator._sources.add(sourceRelative);
            }

            var content = aSourceMapConsumer.sourceContentFor(sourceFile);
            if (content != null) {
              generator.setSourceContent(sourceFile, content);
            }
          });
          return generator;
        };

      /**
       * Add a single mapping from original source line and column to the generated
       * source's line and column for this source map being created. The mapping
       * object should have the following properties:
       *
       *   - generated: An object with the generated line and column positions.
       *   - original: An object with the original line and column positions.
       *   - source: The original source file (relative to the sourceRoot).
       *   - name: An optional original token name for this mapping.
       */
      SourceMapGenerator.prototype.addMapping =
        function SourceMapGenerator_addMapping(aArgs) {
          var generated = util.getArg(aArgs, 'generated');
          var original = util.getArg(aArgs, 'original', null);
          var source = util.getArg(aArgs, 'source', null);
          var name = util.getArg(aArgs, 'name', null);

          if (!this._skipValidation) {
            this._validateMapping(generated, original, source, name);
          }

          if (source != null) {
            source = String(source);
            if (!this._sources.has(source)) {
              this._sources.add(source);
            }
          }

          if (name != null) {
            name = String(name);
            if (!this._names.has(name)) {
              this._names.add(name);
            }
          }

          this._mappings.add({
            generatedLine: generated.line,
            generatedColumn: generated.column,
            originalLine: original != null && original.line,
            originalColumn: original != null && original.column,
            source: source,
            name: name
          });
        };

      /**
       * Set the source content for a source file.
       */
      SourceMapGenerator.prototype.setSourceContent =
        function SourceMapGenerator_setSourceContent(aSourceFile, aSourceContent) {
          var source = aSourceFile;
          if (this._sourceRoot != null) {
            source = util.relative(this._sourceRoot, source);
          }

          if (aSourceContent != null) {
            // Add the source content to the _sourcesContents map.
            // Create a new _sourcesContents map if the property is null.
            if (!this._sourcesContents) {
              this._sourcesContents = Object.create(null);
            }
            this._sourcesContents[util.toSetString(source)] = aSourceContent;
          } else if (this._sourcesContents) {
            // Remove the source file from the _sourcesContents map.
            // If the _sourcesContents map is empty, set the property to null.
            delete this._sourcesContents[util.toSetString(source)];
            if (Object.keys(this._sourcesContents).length === 0) {
              this._sourcesContents = null;
            }
          }
        };

      /**
       * Applies the mappings of a sub-source-map for a specific source file to the
       * source map being generated. Each mapping to the supplied source file is
       * rewritten using the supplied source map. Note: The resolution for the
       * resulting mappings is the minimium of this map and the supplied map.
       *
       * @param aSourceMapConsumer The source map to be applied.
       * @param aSourceFile Optional. The filename of the source file.
       *        If omitted, SourceMapConsumer's file property will be used.
       * @param aSourceMapPath Optional. The dirname of the path to the source map
       *        to be applied. If relative, it is relative to the SourceMapConsumer.
       *        This parameter is needed when the two source maps aren't in the same
       *        directory, and the source map to be applied contains relative source
       *        paths. If so, those relative source paths need to be rewritten
       *        relative to the SourceMapGenerator.
       */
      SourceMapGenerator.prototype.applySourceMap =
        function SourceMapGenerator_applySourceMap(aSourceMapConsumer, aSourceFile, aSourceMapPath) {
          var sourceFile = aSourceFile;
          // If aSourceFile is omitted, we will use the file property of the SourceMap
          if (aSourceFile == null) {
            if (aSourceMapConsumer.file == null) {
              throw new Error(
                'SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, ' +
                'or the source map\'s "file" property. Both were omitted.'
              );
            }
            sourceFile = aSourceMapConsumer.file;
          }
          var sourceRoot = this._sourceRoot;
          // Make "sourceFile" relative if an absolute Url is passed.
          if (sourceRoot != null) {
            sourceFile = util.relative(sourceRoot, sourceFile);
          }
          // Applying the SourceMap can add and remove items from the sources and
          // the names array.
          var newSources = new ArraySet();
          var newNames = new ArraySet();

          // Find mappings for the "sourceFile"
          this._mappings.unsortedForEach(function (mapping) {
            if (mapping.source === sourceFile && mapping.originalLine != null) {
              // Check if it can be mapped by the source map, then update the mapping.
              var original = aSourceMapConsumer.originalPositionFor({
                line: mapping.originalLine,
                column: mapping.originalColumn
              });
              if (original.source != null) {
                // Copy mapping
                mapping.source = original.source;
                if (aSourceMapPath != null) {
                  mapping.source = util.join(aSourceMapPath, mapping.source)
                }
                if (sourceRoot != null) {
                  mapping.source = util.relative(sourceRoot, mapping.source);
                }
                mapping.originalLine = original.line;
                mapping.originalColumn = original.column;
                if (original.name != null) {
                  mapping.name = original.name;
                }
              }
            }

            var source = mapping.source;
            if (source != null && !newSources.has(source)) {
              newSources.add(source);
            }

            var name = mapping.name;
            if (name != null && !newNames.has(name)) {
              newNames.add(name);
            }

          }, this);
          this._sources = newSources;
          this._names = newNames;

          // Copy sourcesContents of applied map.
          aSourceMapConsumer.sources.forEach(function (sourceFile) {
            var content = aSourceMapConsumer.sourceContentFor(sourceFile);
            if (content != null) {
              if (aSourceMapPath != null) {
                sourceFile = util.join(aSourceMapPath, sourceFile);
              }
              if (sourceRoot != null) {
                sourceFile = util.relative(sourceRoot, sourceFile);
              }
              this.setSourceContent(sourceFile, content);
            }
          }, this);
        };

      /**
       * A mapping can have one of the three levels of data:
       *
       *   1. Just the generated position.
       *   2. The Generated position, original position, and original source.
       *   3. Generated and original position, original source, as well as a name
       *      token.
       *
       * To maintain consistency, we validate that any new mapping being added falls
       * in to one of these categories.
       */
      SourceMapGenerator.prototype._validateMapping =
        function SourceMapGenerator_validateMapping(aGenerated, aOriginal, aSource,
                                                    aName)
        {
          // When aOriginal is truthy but has empty values for .line and .column,
          // it is most likely a programmer error. In this case we throw a very
          // specific error message to try to guide them the right way.
          // For example: https://github.com/Polymer/polymer-bundler/pull/519
          if (aOriginal && typeof aOriginal.line !== 'number' && typeof aOriginal.column !== 'number') {
            throw new Error(
              'original.line and original.column are not numbers -- you probably meant to omit ' +
              'the original mapping entirely and only map the generated position. If so, pass ' +
              'null for the original mapping instead of an object with empty or null values.'
            );
          }

          if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
            && aGenerated.line > 0 && aGenerated.column >= 0
            && !aOriginal && !aSource && !aName)
          {
            // Case 1.
            return;
          }
          else if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
            && aOriginal && 'line' in aOriginal && 'column' in aOriginal
            && aGenerated.line > 0 && aGenerated.column >= 0
            && aOriginal.line > 0 && aOriginal.column >= 0
            && aSource)
          {
            // Cases 2 and 3.
            return;
          }
          else {
            throw new Error('Invalid mapping: ' + JSON.stringify({
              generated: aGenerated,
              source: aSource,
              original: aOriginal,
              name: aName
            }));
          }
        };

      /**
       * Serialize the accumulated mappings in to the stream of base 64 VLQs
       * specified by the source map format.
       */
      SourceMapGenerator.prototype._serializeMappings =
        function SourceMapGenerator_serializeMappings() {
          var previousGeneratedColumn = 0;
          var previousGeneratedLine = 1;
          var previousOriginalColumn = 0;
          var previousOriginalLine = 0;
          var previousName = 0;
          var previousSource = 0;
          var result = '';
          var next;
          var mapping;
          var nameIdx;
          var sourceIdx;

          var mappings = this._mappings.toArray();
          for (var i = 0, len = mappings.length; i < len; i++) {
            mapping = mappings[i];
            next = ''

            if (mapping.generatedLine !== previousGeneratedLine) {
              previousGeneratedColumn = 0;
              while (mapping.generatedLine !== previousGeneratedLine) {
                next += ';';
                previousGeneratedLine++;
              }
            }
            else {
              if (i > 0) {
                if (!util.compareByGeneratedPositionsInflated(mapping, mappings[i - 1])) {
                  continue;
                }
                next += ',';
              }
            }

            next += base64VLQ.encode(mapping.generatedColumn
              - previousGeneratedColumn);
            previousGeneratedColumn = mapping.generatedColumn;

            if (mapping.source != null) {
              sourceIdx = this._sources.indexOf(mapping.source);
              next += base64VLQ.encode(sourceIdx - previousSource);
              previousSource = sourceIdx;

              // lines are stored 0-based in SourceMap spec version 3
              next += base64VLQ.encode(mapping.originalLine - 1
                - previousOriginalLine);
              previousOriginalLine = mapping.originalLine - 1;

              next += base64VLQ.encode(mapping.originalColumn
                - previousOriginalColumn);
              previousOriginalColumn = mapping.originalColumn;

              if (mapping.name != null) {
                nameIdx = this._names.indexOf(mapping.name);
                next += base64VLQ.encode(nameIdx - previousName);
                previousName = nameIdx;
              }
            }

            result += next;
          }

          return result;
        };

      SourceMapGenerator.prototype._generateSourcesContent =
        function SourceMapGenerator_generateSourcesContent(aSources, aSourceRoot) {
          return aSources.map(function (source) {
            if (!this._sourcesContents) {
              return null;
            }
            if (aSourceRoot != null) {
              source = util.relative(aSourceRoot, source);
            }
            var key = util.toSetString(source);
            return Object.prototype.hasOwnProperty.call(this._sourcesContents, key)
              ? this._sourcesContents[key]
              : null;
          }, this);
        };

      /**
       * Externalize the source map.
       */
      SourceMapGenerator.prototype.toJSON =
        function SourceMapGenerator_toJSON() {
          var map = {
            version: this._version,
            sources: this._sources.toArray(),
            names: this._names.toArray(),
            mappings: this._serializeMappings()
          };
          if (this._file != null) {
            map.file = this._file;
          }
          if (this._sourceRoot != null) {
            map.sourceRoot = this._sourceRoot;
          }
          if (this._sourcesContents) {
            map.sourcesContent = this._generateSourcesContent(map.sources, map.sourceRoot);
          }

          return map;
        };

      /**
       * Render the source map being generated to a string.
       */
      SourceMapGenerator.prototype.toString =
        function SourceMapGenerator_toString() {
          return JSON.stringify(this.toJSON());
        };

      exports.SourceMapGenerator = SourceMapGenerator;

    }, { "./array-set": 48, "./base64-vlq": 49, "./mapping-list": 52, "./util": 57 }],
    56: [function (require, module, exports) {
      /* -*- Mode: js; js-indent-level: 2; -*- */
      /*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

      var SourceMapGenerator = require('./source-map-generator').SourceMapGenerator;
      var util = require('./util');

// Matches a Windows-style `\r\n` newline or a `\n` newline used by all other
// operating systems these days (capturing the result).
      var REGEX_NEWLINE = /(\r?\n)/;

// Newline character code for charCodeAt() comparisons
      var NEWLINE_CODE = 10;

// Private symbol for identifying `SourceNode`s when multiple versions of
// the source-map library are loaded. This MUST NOT CHANGE across
// versions!
      var isSourceNode = "$$$isSourceNode$$$";

      /**
       * SourceNodes provide a way to abstract over interpolating/concatenating
       * snippets of generated JavaScript source code while maintaining the line and
       * column information associated with the original source code.
       *
       * @param aLine The original line number.
       * @param aColumn The original column number.
       * @param aSource The original source's filename.
       * @param aChunks Optional. An array of strings which are snippets of
       *        generated JS, or other SourceNodes.
       * @param aName The original identifier.
       */
      function SourceNode(aLine, aColumn, aSource, aChunks, aName) {
        this.children = [];
        this.sourceContents = {};
        this.line = aLine == null ? null : aLine;
        this.column = aColumn == null ? null : aColumn;
        this.source = aSource == null ? null : aSource;
        this.name = aName == null ? null : aName;
        this[isSourceNode] = true;
        if (aChunks != null) {
          this.add(aChunks);
        }
      }

      /**
       * Creates a SourceNode from generated code and a SourceMapConsumer.
       *
       * @param aGeneratedCode The generated code
       * @param aSourceMapConsumer The SourceMap for the generated code
       * @param aRelativePath Optional. The path that relative sources in the
       *        SourceMapConsumer should be relative to.
       */
      SourceNode.fromStringWithSourceMap =
        function SourceNode_fromStringWithSourceMap(aGeneratedCode, aSourceMapConsumer, aRelativePath) {
          // The SourceNode we want to fill with the generated code
          // and the SourceMap
          var node = new SourceNode();

          // All even indices of this array are one line of the generated code,
          // while all odd indices are the newlines between two adjacent lines
          // (since `REGEX_NEWLINE` captures its match).
          // Processed fragments are accessed by calling `shiftNextLine`.
          var remainingLines = aGeneratedCode.split(REGEX_NEWLINE);
          var remainingLinesIndex = 0;
          var shiftNextLine = function () {
            var lineContents = getNextLine();
            // The last line of a file might not have a newline.
            var newLine = getNextLine() || "";
            return lineContents + newLine;

            function getNextLine() {
              return remainingLinesIndex < remainingLines.length ?
                remainingLines[remainingLinesIndex++] : undefined;
            }
          };

          // We need to remember the position of "remainingLines"
          var lastGeneratedLine = 1, lastGeneratedColumn = 0;

          // The generate SourceNodes we need a code range.
          // To extract it current and last mapping is used.
          // Here we store the last mapping.
          var lastMapping = null;

          aSourceMapConsumer.eachMapping(function (mapping) {
            if (lastMapping !== null) {
              // We add the code from "lastMapping" to "mapping":
              // First check if there is a new line in between.
              if (lastGeneratedLine < mapping.generatedLine) {
                // Associate first line with "lastMapping"
                addMappingWithCode(lastMapping, shiftNextLine());
                lastGeneratedLine++;
                lastGeneratedColumn = 0;
                // The remaining code is added without mapping
              } else {
                // There is no new line in between.
                // Associate the code between "lastGeneratedColumn" and
                // "mapping.generatedColumn" with "lastMapping"
                var nextLine = remainingLines[remainingLinesIndex] || '';
                var code = nextLine.substr(0, mapping.generatedColumn -
                  lastGeneratedColumn);
                remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn -
                  lastGeneratedColumn);
                lastGeneratedColumn = mapping.generatedColumn;
                addMappingWithCode(lastMapping, code);
                // No more remaining code, continue
                lastMapping = mapping;
                return;
              }
            }
            // We add the generated code until the first mapping
            // to the SourceNode without any mapping.
            // Each line is added as separate string.
            while (lastGeneratedLine < mapping.generatedLine) {
              node.add(shiftNextLine());
              lastGeneratedLine++;
            }
            if (lastGeneratedColumn < mapping.generatedColumn) {
              var nextLine = remainingLines[remainingLinesIndex] || '';
              node.add(nextLine.substr(0, mapping.generatedColumn));
              remainingLines[remainingLinesIndex] = nextLine.substr(mapping.generatedColumn);
              lastGeneratedColumn = mapping.generatedColumn;
            }
            lastMapping = mapping;
          }, this);
          // We have processed all mappings.
          if (remainingLinesIndex < remainingLines.length) {
            if (lastMapping) {
              // Associate the remaining code in the current line with "lastMapping"
              addMappingWithCode(lastMapping, shiftNextLine());
            }
            // and add the remaining lines without any mapping
            node.add(remainingLines.splice(remainingLinesIndex).join(""));
          }

          // Copy sourcesContent into SourceNode
          aSourceMapConsumer.sources.forEach(function (sourceFile) {
            var content = aSourceMapConsumer.sourceContentFor(sourceFile);
            if (content != null) {
              if (aRelativePath != null) {
                sourceFile = util.join(aRelativePath, sourceFile);
              }
              node.setSourceContent(sourceFile, content);
            }
          });

          return node;

          function addMappingWithCode(mapping, code) {
            if (mapping === null || mapping.source === undefined) {
              node.add(code);
            } else {
              var source = aRelativePath
                ? util.join(aRelativePath, mapping.source)
                : mapping.source;
              node.add(new SourceNode(mapping.originalLine,
                mapping.originalColumn,
                source,
                code,
                mapping.name));
            }
          }
        };

      /**
       * Add a chunk of generated JS to this source node.
       *
       * @param aChunk A string snippet of generated JS code, another instance of
       *        SourceNode, or an array where each member is one of those things.
       */
      SourceNode.prototype.add = function SourceNode_add(aChunk) {
        if (Array.isArray(aChunk)) {
          aChunk.forEach(function (chunk) {
            this.add(chunk);
          }, this);
        }
        else if (aChunk[isSourceNode] || typeof aChunk === "string") {
          if (aChunk) {
            this.children.push(aChunk);
          }
        }
        else {
          throw new TypeError(
            "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
          );
        }
        return this;
      };

      /**
       * Add a chunk of generated JS to the beginning of this source node.
       *
       * @param aChunk A string snippet of generated JS code, another instance of
       *        SourceNode, or an array where each member is one of those things.
       */
      SourceNode.prototype.prepend = function SourceNode_prepend(aChunk) {
        if (Array.isArray(aChunk)) {
          for (var i = aChunk.length - 1; i >= 0; i--) {
            this.prepend(aChunk[i]);
          }
        }
        else if (aChunk[isSourceNode] || typeof aChunk === "string") {
          this.children.unshift(aChunk);
        }
        else {
          throw new TypeError(
            "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
          );
        }
        return this;
      };

      /**
       * Walk over the tree of JS snippets in this node and its children. The
       * walking function is called once for each snippet of JS and is passed that
       * snippet and the its original associated source's line/column location.
       *
       * @param aFn The traversal function.
       */
      SourceNode.prototype.walk = function SourceNode_walk(aFn) {
        var chunk;
        for (var i = 0, len = this.children.length; i < len; i++) {
          chunk = this.children[i];
          if (chunk[isSourceNode]) {
            chunk.walk(aFn);
          }
          else {
            if (chunk !== '') {
              aFn(chunk, {
                source: this.source,
                line: this.line,
                column: this.column,
                name: this.name
              });
            }
          }
        }
      };

      /**
       * Like `String.prototype.join` except for SourceNodes. Inserts `aStr` between
       * each of `this.children`.
       *
       * @param aSep The separator.
       */
      SourceNode.prototype.join = function SourceNode_join(aSep) {
        var newChildren;
        var i;
        var len = this.children.length;
        if (len > 0) {
          newChildren = [];
          for (i = 0; i < len - 1; i++) {
            newChildren.push(this.children[i]);
            newChildren.push(aSep);
          }
          newChildren.push(this.children[i]);
          this.children = newChildren;
        }
        return this;
      };

      /**
       * Call String.prototype.replace on the very right-most source snippet. Useful
       * for trimming whitespace from the end of a source node, etc.
       *
       * @param aPattern The pattern to replace.
       * @param aReplacement The thing to replace the pattern with.
       */
      SourceNode.prototype.replaceRight = function SourceNode_replaceRight(aPattern, aReplacement) {
        var lastChild = this.children[this.children.length - 1];
        if (lastChild[isSourceNode]) {
          lastChild.replaceRight(aPattern, aReplacement);
        }
        else if (typeof lastChild === 'string') {
          this.children[this.children.length - 1] = lastChild.replace(aPattern, aReplacement);
        }
        else {
          this.children.push(''.replace(aPattern, aReplacement));
        }
        return this;
      };

      /**
       * Set the source content for a source file. This will be added to the SourceMapGenerator
       * in the sourcesContent field.
       *
       * @param aSourceFile The filename of the source file
       * @param aSourceContent The content of the source file
       */
      SourceNode.prototype.setSourceContent =
        function SourceNode_setSourceContent(aSourceFile, aSourceContent) {
          this.sourceContents[util.toSetString(aSourceFile)] = aSourceContent;
        };

      /**
       * Walk over the tree of SourceNodes. The walking function is called for each
       * source file content and is passed the filename and source content.
       *
       * @param aFn The traversal function.
       */
      SourceNode.prototype.walkSourceContents =
        function SourceNode_walkSourceContents(aFn) {
          for (var i = 0, len = this.children.length; i < len; i++) {
            if (this.children[i][isSourceNode]) {
              this.children[i].walkSourceContents(aFn);
            }
          }

          var sources = Object.keys(this.sourceContents);
          for (var i = 0, len = sources.length; i < len; i++) {
            aFn(util.fromSetString(sources[i]), this.sourceContents[sources[i]]);
          }
        };

      /**
       * Return the string representation of this source node. Walks over the tree
       * and concatenates all the various snippets together to one string.
       */
      SourceNode.prototype.toString = function SourceNode_toString() {
        var str = "";
        this.walk(function (chunk) {
          str += chunk;
        });
        return str;
      };

      /**
       * Returns the string representation of this source node along with a source
       * map.
       */
      SourceNode.prototype.toStringWithSourceMap = function SourceNode_toStringWithSourceMap(aArgs) {
        var generated = {
          code: "",
          line: 1,
          column: 0
        };
        var map = new SourceMapGenerator(aArgs);
        var sourceMappingActive = false;
        var lastOriginalSource = null;
        var lastOriginalLine = null;
        var lastOriginalColumn = null;
        var lastOriginalName = null;
        this.walk(function (chunk, original) {
          generated.code += chunk;
          if (original.source !== null
            && original.line !== null
            && original.column !== null)
          {
            if (lastOriginalSource !== original.source
              || lastOriginalLine !== original.line
              || lastOriginalColumn !== original.column
              || lastOriginalName !== original.name)
            {
              map.addMapping({
                source: original.source,
                original: {
                  line: original.line,
                  column: original.column
                },
                generated: {
                  line: generated.line,
                  column: generated.column
                },
                name: original.name
              });
            }
            lastOriginalSource = original.source;
            lastOriginalLine = original.line;
            lastOriginalColumn = original.column;
            lastOriginalName = original.name;
            sourceMappingActive = true;
          } else if (sourceMappingActive) {
            map.addMapping({
              generated: {
                line: generated.line,
                column: generated.column
              }
            });
            lastOriginalSource = null;
            sourceMappingActive = false;
          }
          for (var idx = 0, length = chunk.length; idx < length; idx++) {
            if (chunk.charCodeAt(idx) === NEWLINE_CODE) {
              generated.line++;
              generated.column = 0;
              // Mappings end at eol
              if (idx + 1 === length) {
                lastOriginalSource = null;
                sourceMappingActive = false;
              } else if (sourceMappingActive) {
                map.addMapping({
                  source: original.source,
                  original: {
                    line: original.line,
                    column: original.column
                  },
                  generated: {
                    line: generated.line,
                    column: generated.column
                  },
                  name: original.name
                });
              }
            } else {
              generated.column++;
            }
          }
        });
        this.walkSourceContents(function (sourceFile, sourceContent) {
          map.setSourceContent(sourceFile, sourceContent);
        });

        return { code: generated.code, map: map };
      };

      exports.SourceNode = SourceNode;

    }, { "./source-map-generator": 55, "./util": 57 }],
    57: [function (require, module, exports) {
      /* -*- Mode: js; js-indent-level: 2; -*- */

      /*
 * Copyright 2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE or:
 * http://opensource.org/licenses/BSD-3-Clause
 */

      /**
       * This is a helper function for getting values from parameter/options
       * objects.
       *
       * @param args The object we are extracting values from
       * @param name The name of the property we are getting.
       * @param defaultValue An optional value to return if the property is missing
       * from the object. If this is not specified and the property is missing, an
       * error will be thrown.
       */
      function getArg(aArgs, aName, aDefaultValue) {
        if (aName in aArgs) {
          return aArgs[aName];
        } else if (arguments.length === 3) {
          return aDefaultValue;
        } else {
          throw new Error('"' + aName + '" is a required argument.');
        }
      }

      exports.getArg = getArg;

      var urlRegexp = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.-]*)(?::(\d+))?(.*)$/;
      var dataUrlRegexp = /^data:.+\,.+$/;

      function urlParse(aUrl) {
        var match = aUrl.match(urlRegexp);
        if (!match) {
          return null;
        }
        return {
          scheme: match[1],
          auth: match[2],
          host: match[3],
          port: match[4],
          path: match[5]
        };
      }

      exports.urlParse = urlParse;

      function urlGenerate(aParsedUrl) {
        var url = '';
        if (aParsedUrl.scheme) {
          url += aParsedUrl.scheme + ':';
        }
        url += '//';
        if (aParsedUrl.auth) {
          url += aParsedUrl.auth + '@';
        }
        if (aParsedUrl.host) {
          url += aParsedUrl.host;
        }
        if (aParsedUrl.port) {
          url += ":" + aParsedUrl.port
        }
        if (aParsedUrl.path) {
          url += aParsedUrl.path;
        }
        return url;
      }

      exports.urlGenerate = urlGenerate;

      /**
       * Normalizes a path, or the path portion of a URL:
       *
       * - Replaces consecutive slashes with one slash.
       * - Removes unnecessary '.' parts.
       * - Removes unnecessary '<dir>/..' parts.
       *
       * Based on code in the Node.js 'path' core module.
       *
       * @param aPath The path or url to normalize.
       */
      function normalize(aPath) {
        var path = aPath;
        var url = urlParse(aPath);
        if (url) {
          if (!url.path) {
            return aPath;
          }
          path = url.path;
        }
        var isAbsolute = exports.isAbsolute(path);

        var parts = path.split(/\/+/);
        for (var part, up = 0, i = parts.length - 1; i >= 0; i--) {
          part = parts[i];
          if (part === '.') {
            parts.splice(i, 1);
          } else if (part === '..') {
            up++;
          } else if (up > 0) {
            if (part === '') {
              // The first part is blank if the path is absolute. Trying to go
              // above the root is a no-op. Therefore we can remove all '..' parts
              // directly after the root.
              parts.splice(i + 1, up);
              up = 0;
            } else {
              parts.splice(i, 2);
              up--;
            }
          }
        }
        path = parts.join('/');

        if (path === '') {
          path = isAbsolute ? '/' : '.';
        }

        if (url) {
          url.path = path;
          return urlGenerate(url);
        }
        return path;
      }

      exports.normalize = normalize;

      /**
       * Joins two paths/URLs.
       *
       * @param aRoot The root path or URL.
       * @param aPath The path or URL to be joined with the root.
       *
       * - If aPath is a URL or a data URI, aPath is returned, unless aPath is a
       *   scheme-relative URL: Then the scheme of aRoot, if any, is prepended
       *   first.
       * - Otherwise aPath is a path. If aRoot is a URL, then its path portion
       *   is updated with the result and aRoot is returned. Otherwise the result
       *   is returned.
       *   - If aPath is absolute, the result is aPath.
       *   - Otherwise the two paths are joined with a slash.
       * - Joining for example 'http://' and 'www.example.com' is also supported.
       */
      function join(aRoot, aPath) {
        if (aRoot === "") {
          aRoot = ".";
        }
        if (aPath === "") {
          aPath = ".";
        }
        var aPathUrl = urlParse(aPath);
        var aRootUrl = urlParse(aRoot);
        if (aRootUrl) {
          aRoot = aRootUrl.path || '/';
        }

        // `join(foo, '//www.example.org')`
        if (aPathUrl && !aPathUrl.scheme) {
          if (aRootUrl) {
            aPathUrl.scheme = aRootUrl.scheme;
          }
          return urlGenerate(aPathUrl);
        }

        if (aPathUrl || aPath.match(dataUrlRegexp)) {
          return aPath;
        }

        // `join('http://', 'www.example.com')`
        if (aRootUrl && !aRootUrl.host && !aRootUrl.path) {
          aRootUrl.host = aPath;
          return urlGenerate(aRootUrl);
        }

        var joined = aPath.charAt(0) === '/'
          ? aPath
          : normalize(aRoot.replace(/\/+$/, '') + '/' + aPath);

        if (aRootUrl) {
          aRootUrl.path = joined;
          return urlGenerate(aRootUrl);
        }
        return joined;
      }

      exports.join = join;

      exports.isAbsolute = function (aPath) {
        return aPath.charAt(0) === '/' || urlRegexp.test(aPath);
      };

      /**
       * Make a path relative to a URL or another path.
       *
       * @param aRoot The root path or URL.
       * @param aPath The path or URL to be made relative to aRoot.
       */
      function relative(aRoot, aPath) {
        if (aRoot === "") {
          aRoot = ".";
        }

        aRoot = aRoot.replace(/\/$/, '');

        // It is possible for the path to be above the root. In this case, simply
        // checking whether the root is a prefix of the path won't work. Instead, we
        // need to remove components from the root one by one, until either we find
        // a prefix that fits, or we run out of components to remove.
        var level = 0;
        while (aPath.indexOf(aRoot + '/') !== 0) {
          var index = aRoot.lastIndexOf("/");
          if (index < 0) {
            return aPath;
          }

          // If the only part of the root that is left is the scheme (i.e. http://,
          // file:///, etc.), one or more slashes (/), or simply nothing at all, we
          // have exhausted all components, so the path is not relative to the root.
          aRoot = aRoot.slice(0, index);
          if (aRoot.match(/^([^\/]+:\/)?\/*$/)) {
            return aPath;
          }

          ++level;
        }

        // Make sure we add a "../" for each component we removed from the root.
        return Array(level + 1).join("../") + aPath.substr(aRoot.length + 1);
      }

      exports.relative = relative;

      var supportsNullProto = (function () {
        var obj = Object.create(null);
        return !('__proto__' in obj);
      }());

      function identity(s) {
        return s;
      }

      /**
       * Because behavior goes wacky when you set `__proto__` on objects, we
       * have to prefix all the strings in our set with an arbitrary character.
       *
       * See https://github.com/mozilla/source-map/pull/31 and
       * https://github.com/mozilla/source-map/issues/30
       *
       * @param String aStr
       */
      function toSetString(aStr) {
        if (isProtoString(aStr)) {
          return '$' + aStr;
        }

        return aStr;
      }

      exports.toSetString = supportsNullProto ? identity : toSetString;

      function fromSetString(aStr) {
        if (isProtoString(aStr)) {
          return aStr.slice(1);
        }

        return aStr;
      }

      exports.fromSetString = supportsNullProto ? identity : fromSetString;

      function isProtoString(s) {
        if (!s) {
          return false;
        }

        var length = s.length;

        if (length < 9 /* "__proto__".length */) {
          return false;
        }

        if (s.charCodeAt(length - 1) !== 95  /* '_' */ ||
          s.charCodeAt(length - 2) !== 95  /* '_' */ ||
          s.charCodeAt(length - 3) !== 111 /* 'o' */ ||
          s.charCodeAt(length - 4) !== 116 /* 't' */ ||
          s.charCodeAt(length - 5) !== 111 /* 'o' */ ||
          s.charCodeAt(length - 6) !== 114 /* 'r' */ ||
          s.charCodeAt(length - 7) !== 112 /* 'p' */ ||
          s.charCodeAt(length - 8) !== 95  /* '_' */ ||
          s.charCodeAt(length - 9) !== 95  /* '_' */)
        {
          return false;
        }

        for (var i = length - 10; i >= 0; i--) {
          if (s.charCodeAt(i) !== 36 /* '$' */) {
            return false;
          }
        }

        return true;
      }

      /**
       * Comparator between two mappings where the original positions are compared.
       *
       * Optionally pass in `true` as `onlyCompareGenerated` to consider two
       * mappings with the same original source/line/column, but different generated
       * line and column the same. Useful when searching for a mapping with a
       * stubbed out mapping.
       */
      function compareByOriginalPositions(mappingA, mappingB, onlyCompareOriginal) {
        var cmp = strcmp(mappingA.source, mappingB.source);
        if (cmp !== 0) {
          return cmp;
        }

        cmp = mappingA.originalLine - mappingB.originalLine;
        if (cmp !== 0) {
          return cmp;
        }

        cmp = mappingA.originalColumn - mappingB.originalColumn;
        if (cmp !== 0 || onlyCompareOriginal) {
          return cmp;
        }

        cmp = mappingA.generatedColumn - mappingB.generatedColumn;
        if (cmp !== 0) {
          return cmp;
        }

        cmp = mappingA.generatedLine - mappingB.generatedLine;
        if (cmp !== 0) {
          return cmp;
        }

        return strcmp(mappingA.name, mappingB.name);
      }

      exports.compareByOriginalPositions = compareByOriginalPositions;

      /**
       * Comparator between two mappings with deflated source and name indices where
       * the generated positions are compared.
       *
       * Optionally pass in `true` as `onlyCompareGenerated` to consider two
       * mappings with the same generated line and column, but different
       * source/name/original line and column the same. Useful when searching for a
       * mapping with a stubbed out mapping.
       */
      function compareByGeneratedPositionsDeflated(mappingA, mappingB, onlyCompareGenerated) {
        var cmp = mappingA.generatedLine - mappingB.generatedLine;
        if (cmp !== 0) {
          return cmp;
        }

        cmp = mappingA.generatedColumn - mappingB.generatedColumn;
        if (cmp !== 0 || onlyCompareGenerated) {
          return cmp;
        }

        cmp = strcmp(mappingA.source, mappingB.source);
        if (cmp !== 0) {
          return cmp;
        }

        cmp = mappingA.originalLine - mappingB.originalLine;
        if (cmp !== 0) {
          return cmp;
        }

        cmp = mappingA.originalColumn - mappingB.originalColumn;
        if (cmp !== 0) {
          return cmp;
        }

        return strcmp(mappingA.name, mappingB.name);
      }

      exports.compareByGeneratedPositionsDeflated = compareByGeneratedPositionsDeflated;

      function strcmp(aStr1, aStr2) {
        if (aStr1 === aStr2) {
          return 0;
        }

        if (aStr1 === null) {
          return 1; // aStr2 !== null
        }

        if (aStr2 === null) {
          return -1; // aStr1 !== null
        }

        if (aStr1 > aStr2) {
          return 1;
        }

        return -1;
      }

      /**
       * Comparator between two mappings with inflated source and name strings where
       * the generated positions are compared.
       */
      function compareByGeneratedPositionsInflated(mappingA, mappingB) {
        var cmp = mappingA.generatedLine - mappingB.generatedLine;
        if (cmp !== 0) {
          return cmp;
        }

        cmp = mappingA.generatedColumn - mappingB.generatedColumn;
        if (cmp !== 0) {
          return cmp;
        }

        cmp = strcmp(mappingA.source, mappingB.source);
        if (cmp !== 0) {
          return cmp;
        }

        cmp = mappingA.originalLine - mappingB.originalLine;
        if (cmp !== 0) {
          return cmp;
        }

        cmp = mappingA.originalColumn - mappingB.originalColumn;
        if (cmp !== 0) {
          return cmp;
        }

        return strcmp(mappingA.name, mappingB.name);
      }

      exports.compareByGeneratedPositionsInflated = compareByGeneratedPositionsInflated;

      /**
       * Strip any JSON XSSI avoidance prefix from the string (as documented
       * in the source maps specification), and then parse the string as
       * JSON.
       */
      function parseSourceMapInput(str) {
        return JSON.parse(str.replace(/^\)]}'[^\n]*\n/, ''));
      }

      exports.parseSourceMapInput = parseSourceMapInput;

      /**
       * Compute the URL of a source given the the source root, the source's
       * URL, and the source map's URL.
       */
      function computeSourceURL(sourceRoot, sourceURL, sourceMapURL) {
        sourceURL = sourceURL || '';

        if (sourceRoot) {
          // This follows what Chrome does.
          if (sourceRoot[sourceRoot.length - 1] !== '/' && sourceURL[0] !== '/') {
            sourceRoot += '/';
          }
          // The spec says:
          //   Line 4: An optional source root, useful for relocating source
          //   files on a server or removing repeated values in the
          //   “sources” entry.  This value is prepended to the individual
          //   entries in the “source” field.
          sourceURL = sourceRoot + sourceURL;
        }

        // Historically, SourceMapConsumer did not take the sourceMapURL as
        // a parameter.  This mode is still somewhat supported, which is why
        // this code block is conditional.  However, it's preferable to pass
        // the source map URL to SourceMapConsumer, so that this function
        // can implement the source URL resolution algorithm as outlined in
        // the spec.  This block is basically the equivalent of:
        //    new URL(sourceURL, sourceMapURL).toString()
        // ... except it avoids using URL, which wasn't available in the
        // older releases of node still supported by this library.
        //
        // The spec says:
        //   If the sources are not absolute URLs after prepending of the
        //   “sourceRoot”, the sources are resolved relative to the
        //   SourceMap (like resolving script src in a html document).
        if (sourceMapURL) {
          var parsed = urlParse(sourceMapURL);
          if (!parsed) {
            throw new Error("sourceMapURL could not be parsed");
          }
          if (parsed.path) {
            // Strip the last path component, but keep the "/".
            var index = parsed.path.lastIndexOf('/');
            if (index >= 0) {
              parsed.path = parsed.path.substring(0, index + 1);
            }
          }
          sourceURL = join(urlGenerate(parsed), sourceURL);
        }

        return normalize(sourceURL);
      }

      exports.computeSourceURL = computeSourceURL;

    }, {}],
    58: [function (require, module, exports) {
      /*
 * Copyright 2009-2011 Mozilla Foundation and contributors
 * Licensed under the New BSD license. See LICENSE.txt or:
 * http://opensource.org/licenses/BSD-3-Clause
 */
      exports.SourceMapGenerator = require('./lib/source-map-generator').SourceMapGenerator;
      exports.SourceMapConsumer = require('./lib/source-map-consumer').SourceMapConsumer;
      exports.SourceNode = require('./lib/source-node').SourceNode;

    }, { "./lib/source-map-consumer": 54, "./lib/source-map-generator": 55, "./lib/source-node": 56 }],
    59: [function (require, module, exports) {
// Copyright 2014 Simon Lydell
// X11 (“MIT”) Licensed. (See LICENSE.)

      var path = require("path")

      "use strict"

      function urix(aPath) {
        if (path.sep === "\\") {
          return aPath
            .replace(/\\/g, "/")
            .replace(/^[a-z]:\/?/i, "/")
        }
        return aPath
      }

      module.exports = urix

    }, { "path": undefined }],
    60: [function (require, module, exports) {
      var htmlparser2 = require('htmlparser2');
      var css = require('css');
      var color = require('color');

      module.exports = {
        htmlparser2, css, color
      };

    }, { "color": 6, "css": 7, "htmlparser2": 41 }],
    61: [function (require, module, exports) {

    }, {}]
  }, {}, [60])(60)
});
}).catch(function importFailed(err) {
  console.error("Import failed: " + err);
});
  
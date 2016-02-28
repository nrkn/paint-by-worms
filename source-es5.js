(function() {
  F = a.width;
  G = a.height;
  H = c.createImageData(F, G);
  I = [];
  K = [];
  U = [1, 1, 1, 1];
  X = [function(b) {
    return E(b, [b[4], D(b)[1], D(b)[2]]);
  }, function(b) {
    return E(b, [D(b)[0], D(b)[0], C(D(b)[2] + .05, 0, 1)]);
  }, function(b) {
    return E(b, [D(b)[0], D(b)[1], C(D(b)[2] - .05, 0, 1)]);
  }, function(b) {
    return E(b, [D(b)[0], b[4], D(b)[2]]);
  }];
  J = [Math.random(), Math.random(), Math.random()];
  W = [[79, 149, 51], [212, 223, 230], [255, 100, 51], [51, 153, 255]];
  A = function(b, d, e) {
    b *= 6;
    d = [e += d *= .5 > e ? e : 1 - e, e - b % 1 * d * 2, e -= d *= 2, e, e + b % 1 * d, e + d];
    return [255 * d[~~b % 6], 255 * d[(b | 16) % 6], 255 * d[(b | 8) % 6], 255];
  };
  B = function(b, d) {
    for (;0 > b;) {
      b += d;
    }
    return b % d;
  };
  C = function(b, d, e) {
    return b < d ? d : b > e ? e : b;
  };
  D = function(b) {
    return I[B(b[1], G) * F + B(b[0], F)];
  };
  E = function(b, d) {
    I[B(b[1], G) * F + B(b[0], F)] = d;
    for (m = 0;m < U.length;m++) {
      H.data[4 * (B(b[1], G) * F + B(b[0], F)) + m] = C(A(d[0], d[1], d[2])[m], 0, 255);
    }
  };
  for (i = 0;i < G;i++) {
    for (j = 0;j < F;j++) {
      E([j, i], J);
    }
  }
  T = function(b) {
    for (i = 0;i < K.length;i++) {
      for (j = 0;j < K[i][2];j++) {
        K[i][0] += ~~(3 * Math.random()) - 1;
        K[i][1] += ~~(3 * Math.random()) - 1;
        K[i][3](K[i]);
        S = [[K[i][0], K[i][1] - 1], [K[i][0] - 1, K[i][1]], K[i], K[i], [K[i][0] + 1, K[i][1]], [K[i][0], K[i][1] + 1]];
        R = [0, 0, 0];
        for (k = 0;k < S.length;k++) {
          R[0] += D(S[k])[0], R[1] += D(S[k])[1], R[2] += D(S[k])[2];
        }
        E(K[i], [C(R[0] / S.length, 0, 1), C(R[1] / S.length, 0, 1), C(R[2] / S.length, 0, 1)]);
      }
    }
    for (k = 0;k < W.length;k++) {
      for (i = 0;50 > i;i++) {
        for (j = 50 * k;j < 50 * k + 50;j++) {
          U[k] ? (H.data[4 * (B(i, G) * F + B(j, F))] = W[k][0], H.data[4 * (B(i, G) * F + B(j, F)) + 1] = W[k][1], H.data[4 * (B(i, G) * F + B(j, F)) + 2] = W[k][2]) : E([j, i], D([j, i]));
        }
      }
    }
    c.putImageData(H, 0, 0);
    requestAnimationFrame(T);
  };
  a.onclick = function(b) {
    if (200 > b.clientX && 50 > b.clientY) {
      U[~~(b.clientX / 50)] = !U[~~(b.clientX / 50)];
    } else {
      K = [];
      N = [~~(50 * Math.random()) + 1, ~~(50 * Math.random()) + 1, ~~(50 * Math.random()) + 1, ~~(50 * Math.random()) + 1];
      for (j = 0;j < U.length;j++) {
        for (i = 0;U[j] && i < N[j];i++) {
          K[K.length] = [b.clientX, b.clientY, ~~(150 * Math.random()) + 50, X[j], Math.random()];
        }
      }
      K[K.length] = [b.clientX, b.clientY, ~~(150 * Math.random()) + 50, X[0], J[0]];
    }
  };
  T(0);
})();
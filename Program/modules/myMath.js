function mySin(x) {
  if(abs(sin(x)) > 1e6 || abs(sin(x)) < 1e-6) return 0;
  else return sin(x);
}

function myCos(x) {
  if(abs(cos(x)) > 1e6 || abs(cos(x)) < 1e-6) return 0;
  else return cos(x);
}

function mobiusSetup(angle, inversion) {
  let x = angle;
  let zi=[math.complex(0, 0), math.complex(1, 0), math.complex(0, -1)];
  let wi=[math.complex(0, 0), math.complex(myCos(angle), -mySin(angle)), math.complex(-mySin(angle), -myCos(angle))];
  
  a = math.det([[math.multiply(zi[0], wi[0]), wi[0], 1], 
      [math.multiply(zi[1], wi[1]), wi[1], 1], 
      [math.multiply(zi[2], wi[2]), wi[2], 1]]);
  b = math.det([[math.multiply(zi[0], wi[0]), wi[0], wi[0]], 
      [math.multiply(zi[1], wi[1]), wi[1], wi[1]], 
      [math.multiply(zi[2], wi[2]), wi[2], wi[2]]]);
  c = math.det([[zi[0], wi[0], 1], 
      [zi[1], wi[1], 1], 
      [zi[2], wi[2], 1]]);
  d = math.det([[math.multiply(zi[0], wi[0]), zi[0], 1], 
      [math.multiply(zi[1], wi[1]), zi[1], 1], 
      [math.multiply(zi[2], wi[2]), zi[2], 1]]);
  return [a,b,c,d];
}

function mobius2(i, j) {
  let z = math.complex(i, j);
  let w = math.divide(math.add(math.multiply(z, a), b), math.add(math.multiply(z, c), d));
  return [int(math.re(w)) + Ox, wy = int(math.im(w)) + Oy];
}

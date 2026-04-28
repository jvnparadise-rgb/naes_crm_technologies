const { PrismaClient } = require('@prisma/client');
const zlib = require('zlib');

const prisma = new PrismaClient();

const payloadB64Gz = `
H4sIAJex3mgC/6xd23LbOJL9FX4fY6mSdTFuqvLz6F4cxR13TRyd2NybxJ1M1mWnJfX4/y85AKAABCUlKduf
T+by4oEsABQKPf3xv3/8YfPzj9/+/s3X3//xf/7l7//9o9///PHHn3/7+9//+ef/8fP3P/78z//853/5+f//
+I///s9f/+d///v/+cvf/vL3f/78/f/9T7//+z//+fv/8vHf///y8f/817/+6fe//+Xv//3z9z9/+fHf//rX
P/74X3/9V8f/9v3rX3//h3/56U9/+fvvf/9f//KXn//yl7/8+Q//7b9//euvf/3r//Xvv//Lf/1ff/zxP3/8
9f/7r3/97W9/9c/vv/7Vv/71X7/99a+//fWvf/3Lv/7lv/71l7/85c9/+ctf/vKXv/zlL3/5y1/+8pe//OUv
f/nLX/7yl7/85S9/+ctf/vKXv/zlL3/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf
/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/
+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/8
5S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7y
l7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nL
X/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUv
f/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe/
/OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+
8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5
y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zl
L3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKX
v/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf
/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/
+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/8
5S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7y
l7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nL
X/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUv
f/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe/
/OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+
8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5
y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zl
L3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKX
v/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf
/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/
+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/8
5S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7y
l7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nL
X/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUv
f/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe/
/OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+
8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5
y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zl
L3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKX
v/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf
/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/
+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/8
5S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7y
l7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nL
X/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUv
f/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe/
/OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+
8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5
y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zl
L3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKX
v/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf
/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/
+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/8
5S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7y
l7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nL
X/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUv
f/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe/
/OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+
8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5
y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zl
L3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKX
v/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf
/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/
+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/8
5S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7y
l7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nL
X/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUv
f/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe/
/OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+
8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5
y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zl
L3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKX
v/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf
/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/
+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/8
5S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7y
l7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nL
X/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUv
f/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe/
/OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+
8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5
y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zl
L3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKX
v/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf
/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/
+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/8
5S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7y
l7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nL
X/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUv
f/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe/
/OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+
8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5
y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zl
L3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKX
v/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf
/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/
+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/8
5S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7y
l7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nL
X/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUv
f/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe/
/OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+
8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5
y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zl
L3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKX
v/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf
/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/
+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/8
5S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7y
l7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nL
X/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUv
f/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe//OUvf/nLX/7yl7/85S9/+ctf/vKXv/zlL3/5y1/+8pe/
AAAA`.replace(/\s+/g, '');

function cleanString(value) {
  if (value === null || value === undefined) return null;
  const s = String(value).trim();
  return s ? s : null;
}

function cleanNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function parsePayload() {
  const buf = Buffer.from(payloadB64Gz, 'base64');
  const raw = zlib.gunzipSync(buf).toString('utf8');
  return JSON.parse(raw);
}

async function main() {
  const rows = parsePayload();
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error('No opportunity rows found in payload.');
  }

  let inserted = 0;
  let updated = 0;

  for (const row of rows) {
    const name = cleanString(row.name);
    const linkedAccountName = cleanString(row.linkedAccountName);
    const linkedPrimaryContactFullName = cleanString(row.linkedPrimaryContactFullName);

    if (!name) throw new Error('Encountered opportunity with missing name');
    if (!linkedAccountName) throw new Error(`Opportunity "${name}" missing linkedAccountName`);

    const account = await prisma.account.findFirst({
      where: { name: linkedAccountName },
      select: { id: true, name: true }
    });

    if (!account) {
      throw new Error(`Could not find account "${linkedAccountName}" for opportunity "${name}"`);
    }

    let primaryContactId = null;
    if (linkedPrimaryContactFullName) {
      const contact = await prisma.contact.findFirst({
        where: {
          accountId: account.id,
          fullName: linkedPrimaryContactFullName
        },
        select: { id: true, fullName: true }
      });

      if (!contact) {
        throw new Error(`Could not find primary contact "${linkedPrimaryContactFullName}" for opportunity "${name}" under account "${linkedAccountName}"`);
      }

      primaryContactId = contact.id;
    }

    const payload = {
      accountId: account.id,
      primaryContactId,
      name,
      serviceLine: cleanString(row.serviceLine),
      marketSegment: cleanString(row.marketSegment),
      opportunityType: cleanString(row.opportunityType),
      stage: row.stage,
      forecastCategory: row.forecastCategory,
      forecastProbability: cleanNumber(row.forecastProbability),
      forecastPeriod: null,
      expectedCloseDate: row.expectedCloseDate ? new Date(`${row.expectedCloseDate}T00:00:00.000Z`) : null,
      annualRevenue: cleanNumber(row.annualRevenue),
      arr: cleanNumber(row.arr),
      oneTimeRevenue: cleanNumber(row.oneTimeRevenue),
      totalEstimatedRevenue: cleanNumber(row.totalEstimatedRevenue),
      ctsPercent: null,
      marginPercent: null,
      notes: cleanString(row.notes),
      ownerUserId: null,
      createdByUserId: null,
      updatedByUserId: null
    };

    const existing = await prisma.opportunity.findFirst({
      where: {
        accountId: account.id,
        name
      },
      select: { id: true }
    });

    if (existing) {
      await prisma.opportunity.update({
        where: { id: existing.id },
        data: payload
      });
      updated += 1;
      console.log(`UPDATED: ${name} -> ${linkedAccountName}`);
    } else {
      await prisma.opportunity.create({
        data: payload
      });
      inserted += 1;
      console.log(`INSERTED: ${name} -> ${linkedAccountName}`);
    }
  }

  console.log('\n--- import complete ---');
  console.log(`inserted: ${inserted}`);
  console.log(`updated: ${updated}`);
  console.log(`total processed: ${inserted + updated}`);
}

main()
  .catch(async (err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

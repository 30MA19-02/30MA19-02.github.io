function sin(x){
    return Math.sin(x);
}
function cos(x){
    return Math.cos(x);
}
function sinh(x){
    return (Math.exp(+x) - Math.exp(-x))/2;
}
function cosh(x){
    return (Math.exp(+x) + Math.exp(-x))/2;
}
class Matrix{
    constructor(value){
        this.value = value;
        this.dim = [this.value.length, this.value[0].length];
        console.assert(this.dim[0] > 0&&this.dim[1] > 0, "Invalid dimension");
        console.assert(!this.value.some(column => column.length!=this.dim[1]), "Invalid dimension");
    }
    mult(other){
        console.assert(typeof this === typeof other, "Invalid type");
        console.assert(this.dim[1] == other.dim[0], "Invalid dimension");
        return new Matrix(new Array(this.dim[0]).fill(0).map(
            (_,i) => new Array(other.dim[1]).fill(0).map(
                (_,j) => new Array(this.dim[1]).fill(0).reduce(
                    (acc, _, k) => acc + this.value[i][k]*other.value[k][j], 0
                )
            )
        ));
    }
    add(other){
        console.assert(typeof this === typeof other, "Invalid type");
        console.assert(this.dim[0] == other.dim[0], "Invalid dimension");
        console.assert(this.dim[1] == other.dim[1], "Invalid dimension");
        return new Matrix(this.value.map(
            (column,i) => column.map(
                (value,j) => value + other.value[i][j]
            )
        ));
    }
    scale(number){
        return new Matrix(this.value.map(
            (column,i) => column.map(
                (value,j) => value * number
            )
        ));
    }
    transpose(){
        return new Matrix(new Array(this.dim[1]).fill(0).map(
            (_,i) => new Array(this.dim[0]).fill(0).map(
                (_,j) => this.value[j][i]
            )
        ));
    }
    determinant(){
        console.assert(this.dim[0] == this.dim[1], "Rectangular matrix");
        if(this.dim[0]==1) return this.value[0][0];
        return this.value.reduce(
            (column, k) => (k%2?-1:+1) * column[0] * new Matrix(
                new Array(this.dim[0]-1).fill(0).map(
                    (_,i) => new Array(this.dim[1]-1).fill(0).map(
                        (_,j) => this.value[i+(i<k?0:1)][j+1]
                    )
                )
            ).determinant()
        );
    }
}
class Geometry{
    constructor(scale=1){
        this.scale = scale;
        this.transformation = new Matrix([
            [1.0, 0.0, 0.0,],
            [0.0, 1.0, 0.0,],
            [0.0, 0.0, 1.0,],
        ]).scale(this.scale);
    }
    translate(len, dir = 0){
        this.rotate(-dir);
        this.transformation = new Matrix([
                [cosh(this.scale * len), sinh(this.scale * len), 0,],
                [sinh(this.scale * len), cosh(this.scale * len), 0,],
                [        0,         0, 1,],
        ]).mult(this.transformation);
        this.rotate(+dir);
    }
    rotate(ang){
        this.transformation = new Matrix([
                [1,        0,         0,],
                [0, cos(ang), -sin(ang),],
                [0, sin(ang),  cos(ang),],
        ]).mult(this.transformation);
    }
}

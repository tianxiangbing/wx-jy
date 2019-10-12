class HelloNumber<T> {
	zero: T;
	add:(x:T, y:T) => T;
}

var myHelloNumber = new HelloNumber<number> ();
myHelloNumber.zero = 0;
myHelloNumber.add = function(x,y) {
	return x+y;
}
// alert(myHelloNumber.zero); // 10
// alert(myHelloNumber.add('10', 10)); // 20


type Person = {
	name:string,
	age:number
}
let persons :Person[] =[];
function array_column<T,K extends keyof T>(input:T[],key:K){
	return input.map(item=>item[key]);
}
array_column(persons,"age")

class Proxy1<T>{
	constructor(private data:T){

	}
	get<K extends keyof T>(key:K){
		return this.data[key]
	}
	set<K extends keyof T ,V extends T[K]>(key:K,value:V){
		this.data[key] = value;
	}
}
let person:Person = {
	name:'txb',
	age:12
}
let proxy  = new Proxy1(person);
proxy.set("age",1);

function loggingIdentity<T>(arg: T[]): T[] {
    console.log(arg.length);  // Array has a .length, so no more error
    return arg;
}
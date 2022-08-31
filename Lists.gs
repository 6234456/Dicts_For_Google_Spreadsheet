class Lists extends Array {
  constructor(){
    super();
  }

  add(e){
    this.push(e);
    return this;
  }

  take(l){
    return this.slice(0, l);
  }

  drop(l){
    return this.slice(l);
  }

  addAll(...e){
    this.push(...e);
    return this;
  }

  zip(iterable){
    if(iterable instanceof Array){
       let arr = iterable.slice(0, this.length)
       return this.map((e, i)=>{ return [e, arr[i]]});
    }

    throw Error("Type should be iterable")
  }

  flatten(){
    if(this.length == 0)
      return this
    
    return this.reduce((acc, e)=>{
      if(e instanceof Array){
        acc.push(...e)
        acc
      }else
      this.push(e)
    }, new Lists())
  }

  static x2string(x){
    if(x instanceof Lists){
      return x.toString()
    }else if(x instanceof Array){
      return new Lists().addAll(...x).toString()
    }
    
    return  "" + x 
  }

  toString(){
    let s = this.reduce((acc, e)=>`${acc}${Lists.x2string(e)},`, "[ ")
    return s.slice(0, s.length - 1) + " ]";
  }
}

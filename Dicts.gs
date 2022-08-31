class Dicts extends Map{
  constructor(args){
    super(args);
  }

  add(k, v){
    this.set(k, v);
    return this
  }

  get length() {
    return this.size
  }

  get dimension2(){
    if(this.size == 0)
      return 0

    return this.valsArr.map(e=> e.length).reduce((a, b)=> a>=b?a:b);
  }

  static y({sheet = SpreadsheetApp.getActiveSheet()} = {}){
    return sheet.getLastRow()
  }

  static x({sheet = SpreadsheetApp.getActiveSheet()} = {}){
    return sheet.getLastColumn()
  }

  item(k){
    return this.get(k)
  }

  count(){
    return this.size
  }

  get keysArr(){
    let res = []
    let k = this.keys()
    let e = k.next()
    while(true){
      if(e.done){
        return res
      }
      res.push(e.value)
      e = k.next()
    }
  }

  get valsArr(){
    let res = []
    let k = this.values()
    let e = k.next()
    while(true){
      if(e.done){
        return res
      }
      res.push(e.value)
      e = k.next()
    }
  }

  get entriesArr(){
    let res = []
    let k = this.entries()
    let e = k.next()
    while(true){
      if(e.done){
        return res
      }
      res.push(e.value)
      e = k.next()
    }
  }

  filter(fn = (v, k) => true){
    let res = []
    this.forEach((v, k) => {
      if(fn(v, k))
        res.push([k, v])
    })

    return new Dicts(res)
  }

  map(fn = (v, k) => [k, v]){
    let res = []
    this.forEach((v, k) => {
        res.push(fn(v, k))
    })

    return new Dicts(res)
  }

  diff(d2){
    if(d2 instanceof Dicts){
      return this.filter((_,k)=>!d2.has(k))
    }

    throw Error(`only Dicts accepted, received ${typeof(d2)}`)
  }

  intersect(d2){
    if(d2 instanceof Dicts){
      return this.filter((_,k)=> d2.has(k))
    }

    throw Error(`only Dicts accepted, received ${typeof(d2)}`)
  }

  union(d2, updateExisting=true){
    
    if(d2 instanceof Dicts){
      let res = new Dicts(this.entriesArr);

      d2.forEach((v, k)=>{
        if(updateExisting || !this.has(k)){
          res.set(k, v)
        }
      });

      return res;
    }

    throw Error(`only Dicts accepted, received ${typeof(d2)}`)
  }


  load({sheet = SpreadsheetApp.getActiveSheet(), row = 0, keyCol = 0, valCol = [1]} = {}){
    let d = sheet.getDataRange().getValues().slice(row);
    d.map((e, i)=> [e[keyCol], e.filter((_, i0) => valCol.indexOf(i0) > -1)]).forEach(e=> this.add(e[0], e[1]));
    return this
  }

  dump({sheet = SpreadsheetApp.getActiveSheet(), row = 0, keyCol = 0, valCol = 1} = {}){
    sheet.getRange(row, keyCol, this.size, 1).setValues(this.keysArr.map(e=> [e]))
    sheet.getRange(row, valCol, this.size, this.dimension2).setValues(this.valsArr)
  }
}

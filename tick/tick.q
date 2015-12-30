/ meta:`name`uid`fname!(`tick;"G"$"0ebd406c-3c1e-40d1-90bb-9d3410843c36";"tick.q")

\d .tick

meta0:`name`uid`fname!(`tick;"G"$"0ebd406c-3c1e-40d1-90bb-9d3410843c36";"tick.q")
batchTime:200 / 200 millisecond

hft:{[x;y]if[.tick.l;.tick.l(`upd;x;y);.tick.i+:1];pub[x;y] }
batch:{[x;y]}

w:enlist`tbl`w`sym!(`;0ni;1#`)

sub:{if[x~`;:sub[;y]each t];if[not x in t;'x];del[x].z.w;add[x;y]}

add:{[x;y]
  r:select from .tick.w where w = .z.w,tbl=x;
  $[count r;update sym:{union x,y}[y]@'sym from .tick.w where w = .z.w,tbl=x; `.tick.w insert (x;.z.w;(),y)];
  (x;$[99=type v:.init.t x;sel[v]y;0#v] )
}

del:{[x;y]delete from`.tick.w where w = y, tbl=x;};

pub:{[x;y]}

sel:{$[`~y;x;select from (1_x) where sym in y]}

\d .

upd:{(`.tick.batch ^ .init.mode x)[x;y] }

.b.add[`.init.readConf;`.tick.tick]{ .dotz.ts.add[ "p" $00:00:01+.z.d + 1;.b.upd`.tick.endofday]()!();}

.b.add[`.init.readSym;`.tick.setSym]{ (where `.tick.batch = .init.mode:((enlist`)!enlist `.tick.batch), .Q.dd[`.tick]@'`$.init.sym[;`tipe])set\:{}}

.b.add[`.tick.tick`.tick.endofday;`.tick.ld]{
  .tick.L:hsym`$ssr[`.init . `cfg`env`tick`L;"%name";string .init.name],.b.printf("%0-%1.qlog";.z.d;.z.i);
  if[not type key .tick.L; .[.tick.L;();:;()] ];
  .tick.i:.tick.j:-11!(-2;.tick.L);
  if[0<=type .tick.i;
    -2 (string .tick.L)," is a corrupt log. Truncate to length ",(string last .tick.i)," and restart";
    exit 1];
  .tick.l:.z.ho .tick.L}

.b.add[`;`.tick.endofday]{ if[.tick.l;.z.hc .tick.l];.dotz.ts.add[ "p" $00:00:01+.z.d + 1;.b.upd`.tick.endofday]()!();}


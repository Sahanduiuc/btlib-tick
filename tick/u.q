/ meta:`name`uid`fname!(`u;"G"$"76207fb1-afc2-4cc9-a02f-53425557fac5";"u.q")

\d .u

meta0:`name`uid`fname!(`u;"G"$"76207fb1-afc2-4cc9-a02f-53425557fac5";"u.q")
batchTime:200 / 200 millisecond

hft:{[x;y]if[l;l(`upd;x;y);i+:1];pub[x;y] }
batch:{[x;y]}

w:enlist`tbl`w`sym!(`;0ni;1#`)

sub:{del[x].z.w;add[x;y]}

del:{[x;y]delete from`.u.w where w = y, tbl=x;};

add:{[x;y]r:select from .u.w where w = .z.w,tbl=x;
  $[count r;update sym:union[y]@'sym from .u.w where w = .z.w,tbl=x; `.u.w insert (x;.z.w;(),y)];
  / (x;$[99=type v:.init.t x;sel[v]y;0#v] )
 }


\d .

upd:{(`.u.batch ^ .init.mode x)[x;y] }

.b.add[`.init.readConf;`.u.tick]{ .dotz.ts.add[ "p" $00:00:01+.z.d + 1;.b.upd`.u.endofday]()!();}

.b.add[`.init.readSym;`.u.setSym]{ key[.init.t]set'value .init.t;.u.t:key .init.t;}

.b.add[`.u.tick`.u.endofday;`.u.ld]{
  .u.L:hsym`$ssr[`.init . `cfg`env`tick`L;"%name";string .init.name],.b.printf("%0-%1.qlog";.z.d;.z.i);
  if[not type key .u.L; .[.u.L;();:;()] ];
  .u.i:.u.j:-11!(-2;.u.L);
  if[0<=type .u.i;
    -2 (string .u.L)," is a corrupt log. Truncate to length ",(string last .u.i)," and restart";
    exit 1];
  .u.l:.z.ho .u.L}

.b.add[`;`.u.endofday]{ if[.u.l;.z.hc .u.l];.dotz.ts.add[ "p" $00:00:01+.z.d + 1;.b.upd`.u.endofday]()!();}

/


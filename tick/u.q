/ meta:`name`uid`fname!(`u;"G"$"76207fb1-afc2-4cc9-a02f-53425557fac5";"u.q")

\d .u

meta0:`name`uid`fname!(`u;"G"$"76207fb1-afc2-4cc9-a02f-53425557fac5";"u.q")

hft:{[t;x]a:.z.P; if[not -16=type first first x; a:"n"$a; x:$[0>type first x;a,x;(enlist(count first x)#a),x]];f:key flip value t;pub[t;$[0>type first x;enlist f!x;flip f!x]];if[l;l enlist (`upd;t;x);i+:1];}

batch:{[t;x] if[not -16=type first first x; a:"n"$.z.P; x:$[0>type first x;a,x;(enlist(count first x)#a),x]];t insert x;if[l;l enlist (`upd;t;x);j+:1];}

ts:{pub'[t;value each t];i::j;.dotz.ts.add[ get[.init.this.cfg.batchTime]+.z.P;`.u.ts]()!();}

sub:{if[x~`;:sub[;y]each t];if[not x in t;'x];del[x].z.w;add[x;y]}

add:{$[(count w x)>i:w[x;;0]?.z.w; .[`.u.w;(x;i;1);union;y]; w[x],:enlist(.z.w;y)];(x;$[99=type v:value x;sel[v]y;0#v])}

del:{w[x]_:w[x;;0]?y};

sel:{$[`~y;x;select from x where sym in y]}

pub:{[t;x]{[t;x;w] if[count x:sel[x]w 1; (neg first w)(`upd;t;x)]}[t;x]each w t}

end:{ (neg union/[w[;;0]])@\:(".b.upd";`.u.end;enlist[`date]!enlist x)}

\d .

.b.add[`.init.readConf;`.u.tick]{ .dotz.ts.add[ "p" $get[.init.this.cfg.endofday]+.z.D + 1;.b.upd`.u.endofday]()!();}

.b.add[`.init.readConf;`.u.setUpd]{ `upd set .Q.dd[`.u] `$.init.this.cfg.mode;
  if[`batch=`$.init.this.cfg.mode;.dotz.ts.add[ get[.init.this.cfg.batchTime]+.z.P;`.u.ts]()!()];
  }

.b.add[`.init.readSym;`.u.setSym]{ key[.init.t]set'value .init.t; .u.w:.u.t!(count .u.t:key .init.t)#();@[;`sym;`g#]each .u.t;}

.b.add[`.u.tick`.u.endofday;`.u.ld]{.u.d:.z.D;
  .u.L:hsym`$.b.print[.init.this.cfg.L].init.this.cfg,`date`pid`time!.z.D,.z.i,.z.T;
  if[not type key .u.L; .[.u.L;();:;()] ];
  .u.i:.u.j:-11!(-2;.u.L);
  if[0<=type .u.i;
    -2 (string .u.L)," is a corrupt log. Truncate to length ",(string last .u.i)," and restart";
    exit 1];
  .u.l:.z.ho .u.L}

.b.add[`;`.u.endofday]{ if[.u.l;.z.hc .u.l];.dotz.ts.add[ "p" $get[.init.cfg.env.sys.endofday]+.z.D + 1;.b.upd`.u.endofday]()!();.u.end[.u.d];
  }

.b.add[`.dotz.poc.pc;`.u.del]{[zw] .u.del[;zw] each .u.t}

/

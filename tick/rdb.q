/ meta:`name`uid`fname!(`rdb;"G"$"dae00690-71e7-4491-a709-fddf4a873e2f";"rdb.q")

\d .rdb

meta0:`name`uid`fname!(`rdb;"G"$"dae00690-71e7-4491-a709-fddf4a873e2f";"rdb.q")

rep:{ .rdb.t:(.[;();:;].)each x; if[null first y;:()]; -11!y;};

end:{t:tables`.; t@:where `g=attr each t@\:`sym;.Q.dpft[hsym `$.init.this.cfg.hdbroot;x;`sym]@'t;@[;`sym;`g#]@'t;};

upd:insert

\d .

.b.add[`.init.setCfg;`.rdb.setSub]{.rdb.sub:`$.init.this.cfg.sub;upd:: .rdb.upd}

.b.add[`.dotz.acon.evaluate;`.u.rep]{[syms]if[not .rdb.sub in syms;:()];
  .rdb.rep . .dotz.acon.t [.rdb.sub;`w] "(.u.sub[`;`];`.u `i`L)"}

.b.add[`;`.u.end]{[date] .rdb.end date; }

.b.add[`.u.end;`.u.hdb.end]{[date] (neg exec w from .dotz.acon.t where sym in exec sym  from .init.sys where tipe = `hdb)@\:("upd";`.u.end;enlist[`date]!enlist date) }

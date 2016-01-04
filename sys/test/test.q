/ test.test:localhost:37010::

\l qlib/bt/bt.q
.b.l "qlib/dotz/dotz.q"
/ .b.l "qlib/rbt/rbt.q"
.b.l "tick/init.q"
.b.l "tick/init.q"


\d .test

t:enlist`time`sym`fnc`msg`dur`e!(0np;`;{};"  ";0Nn;`)

add:{[trigger;name;msg;func] .b.add[trigger;name]{[name;msg;func;data]
  t0: .z.P; r:@[func;();`$];t1: .z.P; .test.t: .test.t,enlist `time`sym`fnc`msg`dur`e!(t0;name;func;msg;t1 - t0;$[-11h = type r;r;r;`;`failed]);.test.output[];}[name;msg;func] }

output:{if[not count select from .test.t where not null e;:()];(0N!)each exec msg from .test.t where not null sym}

\d .

.b.add[`.b.init;`.test.setTimer]{ .dotz.ts.add[ .z.P + `second$10;.b.upd`.test.init]()!(); }

.test.add[`.test.init;`.test.acon;"autoconnect error"]{not count select from .dotz.acon.t where not null sym, null w}

.test.add[`.test.acon;`.test.tick.logfile;"no logfile"]{"b"$type key .dotz.acon.t [`tick.tick;`w] ".u.L"}

.test.add[`.test.tick.logfile;`.test.tick.sendData;"send data"]{.dotz.acon.t[`tick.tick;`w] ("upd";`Trades;1_value flip 10# .init.t`Trades);.dotz.ts.add[ .z.P + `second$3;.b.upd`.test.tick.data]()!(); }

.test.add[`.test.tick.data;`.test.tick.u.i;"u.i error"]{0 < .dotz.acon.t[`tick.tick;`w] ".u.i" }

.test.add[`.test.tick.data;`.test.rdb.trade;"rdb trade error"]{0 < count .dotz.acon.t[`rdb.rdb;`w] "Trades"}

.b.upd[`.b.init].Q.opt .z.x;


/
r) library(ggplot2)
p) plot(c(1,2,3,4))
select from .test.t where not null e

select from .b.flows where not null error


.init.name

first exec sym from .init.sys where tipe=`tick

.dotz.acon.t [`tick.tick;`w] ".u.w"



.dotz.acon.t[`tick.tick;`w] ".u.i"

.dotz.acon.t[`rdb.rdb;`w] "Trades"

.dotz.acon.t[`tick.tick;`w] ".u.w"



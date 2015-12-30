
args:.Q.def[`name`port!("main";8888);].Q.opt .z.x

/ remove this line when using in production
/ main:localhost:8888::
{ if[not x=0; @[x;"\\\\";()]]; value"\\p 8888"; } @[hopen;`:localhost:8888;0];

/ tick.tick:localhost:14010::
/ hdb.hdb:localhost:16010::
/ rdb.rdb:localhost:15010::
/ feed.feed:localhost:17010::
/ testAll.test:localhost:30010::


cfg:.j.k "\n"sv read0`:sys/system.json


(::)t:ungroup {([]grp:key y;basePort: {$[`basePort in key y;y;x]`basePort}[x]@'value[y];process:value[y][;`process])}[cfg . `env`sys]cfg`sys
(::)t:select grp,basePort,name:`$process[;`name],tipe:`$process[;`tipe],port:process[;`port],host:{[x;y]$[not count y;x;y]}[cfg . `env`sys`host]@'process[;`host] from t
(::)t:update port:{string get ssr[y;"basePort";x]}'[string basePort;port] from t;.init.cfg:update sym:.Q.dd'[grp;name],hp:{`$":"sv("  ";x;y)}'[host;port] from t

plant:update h:{@[hopen;(x;1000);0ni]}@'hp from select sym:.Q.dd'[grp;name],hp:{`$":" sv ("  ";x;y)}'[host;port] from t


(::)flows:raze exec {x ({`plant xcols update plant:x from .b.flows};y)}'[h;sym] from plant

select count i by sym from flows

(::)flows:raze exec {x ({`plant xcols update plant:x from select from .b.flows where not null error};y)}'[h;sym] from plant

(::)dotz.acon.t:raze exec {x ({`plant xcols update plant:x from 0!select from .dotz.acon.t};y)}'[h;sym] from plant

/ meta:`name`uid`fname!(`init;"G"$"83286298-638b-4bec-92c9-16ef78abcbcf";"init.q")

\d .init
meta0:`name`uid`fname!(`init;"G"$"83286298-638b-4bec-92c9-16ef78abcbcf";"init.q")
name:first `$.Q.opt[.z.x]`name

lg:{[x;y] 1 .b.print["%0\t%1\t%2\t%3\n"] (.z.p;.init.name;x;y)}

info:lg[`info]
error:lg[`error]

\d .

b) `.b.init
   `.init.readConf
   {[cfg] .init.cfg:.j.k "\n"sv read0 hsym `$first cfg;(enlist `cfg)!enlist .init.cfg}

b) `.init.readConf
   `.init.confFiltering
   {[cfg] t:ungroup {([]grp:key y;basePort: {$[`basePort in key y;y;x]`basePort}[x]@'value[y];process:value[y][;`process])}[cfg . `env`sys]cfg`sys;t:select grp,basePort,name:`$process[;`name],tipe:`$process[;`tipe],port:process[;`port],host:{[x;y]$[not count y;x;y]}[cfg . `env`sys`host]@'process[;`host] from t;t:update port:{string get ssr[y;"basePort";x]}'[string basePort;port] from t;.init.sys:update sym:.Q.dd'[grp;name],hp:{`$":"sv("  ";x;y)}'[host;port] from t; }

b) `.init.readConf
   `.init.setCfg
   {[cfg]grp:first nme:` vs .init.name;nme:nme 1;.init.this.cfg:(.init.cfg.env `$a`tipe),(.init.cfg.env.sys), a:(enlist[`group]!enlist string grp ),first select from  .init.cfg . `sys,grp,`process where name ~\: string nme;.init.this.cfg}

b) `.init.confFiltering
   `.init.acon
   {(.dotz.acon.add') .  value exec sym,hp from .init.sys}

b) `.init.setCfg
   `.init.readSym
   {[cmd] .init.sym:.j.k "\n"sv read0 hsym `$cmd `sym;(enlist `sym)!enlist .init.sym}

b) `.init.readSym
   `.init.symFiltering
   {[sym].init.t:t!{$[`key in key x;`$x`key;()]xkey flip(`$x`columns)!(`$x`format)$\:()}'[.init.sym t:key .init.sym]}

b) `.dotz.acon.evaluate
   `.dotz.acon.shakehand
   {[connected] (neg exec w from .dotz.acon.t where sym in connected,not w=0)@\:(`.b.upd;`.dotz.acon.handshaked;first select from .init.sys where sym = .init.name); }

b) `
   `.dotz.acon.handshaked
   {[data] `.dotz.acon.t upsert select sym,time:.z.P,arg:hp,w:.z.w from enlist ` _ data }




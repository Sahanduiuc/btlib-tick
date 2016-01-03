
args:.Q.def[`name`port!("main";8888);].Q.opt .z.x

/ remove this line when using in production
/ main:localhost:8888::
{ if[not x=0; @[x;"\\\\";()]]; value"\\p 8888"; } @[hopen;`:localhost:8888;0];

/ tick.tick:localhost:14010::
/ hdb.hdb:localhost:16010::
/ rdb.rdb:localhost:15010::
/ feed.feed:localhost:17010::
/ testAll.test:localhost:30010::

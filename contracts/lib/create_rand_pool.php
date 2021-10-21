<?php
/**
	生成随机池
*/
$attr11 = [
	["min"=>90, "max"=>92, "times"=>5],
	["min"=>93, "max"=>96, "times"=>6],
	["min"=>97, "max"=>98, "times"=>3],
	["min"=>99, "max"=>99, "times"=>2],
	["min"=>100, "max"=>100, "times"=>1],
];
$attr12 = [
	["min"=>85, "max"=>94, "times"=>6],
	["min"=>95, "max"=>97, "times"=>3],
	["min"=>98, "max"=>99, "times"=>2],
	["min"=>100, "max"=>100, "times"=>1],
];
$attr13 = [
	["min"=>60, "max"=>91, "times"=>5],
	["min"=>85, "max"=>92, "times"=>2],
];
$attr2 = [
	["min"=>10, "max"=>30, "times"=>2],
	["min"=>31, "max"=>85, "times"=>4],
	["min"=>86, "max"=>90, "times"=>2],
];
$attr3 = [
	["min"=>10, "max"=>50, "times"=>3],
	["min"=>51, "max"=>80, "times"=>2],
	["min"=>81, "max"=>85, "times"=>1],
];
$types = [
	["min"=>1, "max"=>1, "times"=>20],
	["min"=>2, "max"=>2, "times"=>18],
	["min"=>3, "max"=>3, "times"=>12],
];

function create($arr) {
	$ret = [];
	foreach($arr as $item) {
		for ($i = $item["min"]; $i<=$item["max"]; $i++) {
			for ($j=0; $j<$item["times"]; $j++) {
				$ret[] = $i;
			}
		}
	}
	shuffle($ret);
	echo implode(",", $ret). "\n\n";
}	

echo "attr11\n";
create($attr11);
echo "attr12\n";
create($attr12);
echo "attr13\n";
create($attr13);
echo "attr2\n";
create($attr2);
echo "attr3\n";
create($attr3);
echo "types\n";
create($types);
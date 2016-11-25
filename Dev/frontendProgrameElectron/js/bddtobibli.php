<?php
/**
 * Created by PhpStorm.
 * User: GillesBeernaut
 * Date: 13/10/16
 * Time: 10:32
 */

$dir = 'sqlite:../sharelist/assets/sharelist.db';
$dbh  = new PDO($dir) or die("cannot open the database");
$query =  "SELECT * FROM library order by artist, song LIMIT 30,300";

function secToMin($seconds){
  $time = gmdate("i:s", $seconds);
  return $time;
}

function human_filesize($bytes, $decimals = 1) {
  $sz = 'BKMGTP';
  $factor = floor((strlen($bytes) - 1) / 3);
  return sprintf("%.{$decimals}f", $bytes / pow(1024, $factor)) . @$sz[$factor];
}

echo exec("/sbin/ifconfig en1 | grep 'inet ' | cut -d ' ' -f2");

echo '
<table id="table-bdd" class="table table-striped table-inverse">
  <thead>
    <tr>
        <th></th>
        <th>Morceau</th>
        <th>Artiste</th>
        <th>Durée</th>
        <th>Album</th>
    </tr>
  </thead>
  <tbody>';
$nb = 0;
foreach ($dbh->query($query) as $row) {
$nb++;
$path = $row['path'];
$path = str_replace(' ', '%20', $path);

echo "
    <tr>
      <td class='add'>
        <div class='add-icon'><i class='fa fa-plus' aria-hidden='true'></i><span class='add-text'>Ajouter</span></div>
        <div class='number'>" . $nb . "</div>
      </td>
      <td>" . $row['song'] . "</td>
      <td>" . $row['artist'] . "</td>
      <td>" . secToMin($row['duration']) . "</td>
      <td>" . $row['album'] . "</td>
    </tr>
    ";
    }
echo "
  </tbody>
</table>";

?>

<?php
/* CONFIG */
//$pathToAssets = array("elements/assets", "elements/stylesheets", "elements/fonts", "elements/images/main", "elements/images/icons", "elements/js-files", "elements/pix_mail", "elements/images/social_icons", "elements/images/switch", "elements/images/testimonials", "elements/images/uploads");
$pathToAssets = array("elements/assets", "elements/stylesheets", "elements/fonts", "elements/pix_mail", "elements/js-files");
$filename = "../landingpage/website.zip"; //use the /tmp folder to circumvent any permission issues on the root folder
/* END CONFIG */
$tmpfilename = './tmp/website.zip';
if (file_exists($tmpfilename)) {
    unlink($tmpfilename);
}

$external_css_files = true;

$form_type_export = $_POST['form_type_export'];
$imgs = json_decode($_POST['pix_export_imgs_Field']);
$imgs[] = "images/favicon.ico";

$zip = new ZipArchive();
$zip->open($filename, ZipArchive::CREATE);

$dirs = array();
$doc = new DOMDocument();
$doc->recover = true;
$doc->strictErrorChecking = false;
libxml_use_internal_errors(true);

foreach ($_POST['pages'] as $page => $content2) {
    $doc->recover = true;
    $doc->strictErrorChecking = false;
    $doc->loadHTML(stripslashes($content2));
    $selector = new DOMXPath($doc);

    $result = $selector->query('//div[@class="section_pointer"]');
    // loop through all found items
    if ($result->length > 0) {
        foreach ($result as $node) {
            //array_push($dirs, $node->getAttribute('pix-name'));
            if (!in_array('elements/images/' . $node->getAttribute('pix-name'), $dirs, true)) {
                array_push($dirs, 'elements/images/' . $node->getAttribute('pix-name'));
            }
        }
        $pathToAssets = array_merge($pathToAssets, $dirs);
    }
}
//add folder structure
foreach ($pathToAssets as $thePath) {
    // Create recursive directory iterator
    $files = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($thePath),
        RecursiveIteratorIterator::LEAVES_ONLY
    );
    foreach ($files as $name => $file) {
        if ($file->getFilename() != '.' && $file->getFilename() != '..') {
            // Get real path for current file
            $filePath = $file->getRealPath();
            $temp = explode("/", $name);
            array_shift($temp);
            $newName = implode("/", $temp);
            // Add current file to archive
            $zip->addFile($filePath, $newName);
        }
    }
}
foreach ($imgs as $img) {
    $zip->addFile("elements/" . $img, $img);
}

$skeleton1 = file_get_contents('elements/sk1.html');
$skeleton2 = file_get_contents('elements/sk2.html');
$skeleton3 = file_get_contents('elements/sk3.html');

foreach ($_POST['pages'] as $page => $content) {
    $t_seo = json_decode($_POST['seo'][$page]);
    $t_css = json_decode($_POST['css'][$page]);
    $seo_tags = '<title>' . $t_seo[0] . '</title>' . "\n" . '<meta name="description" content="' . $t_seo[1] . '">' . "\n" . '<meta name="keywords" content="' . $t_seo[2] . '">' . "\n" . $t_seo[3];
    $customStyle = "\n</head>\n<body>";
    if (!empty($t_css)) {
        if ($external_css_files) {
            $customStyle = "    <link rel=\"stylesheet\" href=\"stylesheets/custom/" . $page . ".css\">\n</head>\n<body>";
            $zip->deleteName('stylesheets\custom\\' . $page . '.css');
            $zip->addFromString("stylesheets/custom/" . $page . ".css", $t_css);
        } else {
            if (!empty($t_css)) {
                $customStyle = "    <style type=\"text/css\" id=\"pix_style\">\n" . $t_css . "\n</style>\n</head>\n<body>";
            }
        }
    }
    $new_content = $skeleton1 . $seo_tags . $skeleton2 . $customStyle . stripslashes($content) . $skeleton3;
    $zip->addFromString($page . ".html", stripslashes($new_content));
}

//$zip->deleteName('pix_mail\config.php');
//$zip->addFromString("pix_mail/config.php", $pixfort_mail);
$zip->close();

$yourfile = $filename;
$file_name = basename($yourfile);
header("Content-Type: application/zip");
header("Content-Transfer-Encoding: Binary");
header("Content-Disposition: attachment; filename=$file_name");
header("Content-Length: " . filesize($yourfile));
readfile($yourfile);
//unlink('tmp/website.zip');
$zip = new ZipArchive;
if ($zip->open($yourfile) === TRUE) {
    $zip->extractTo('../landing-page/1/');
    $zip->close();
    echo 'ok';
} else {
    echo 'failed';
}
?>
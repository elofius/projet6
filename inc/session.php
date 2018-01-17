<?php
session_start();
isset($_GET['action']) ? $action = $_GET['action'] : $action = "";

if ($action == "affecte"){
    $_SESSION['login'] = $_GET['login'];
}elseif ($action == "deco"){
    unset($_SESSION['login']);
}elseif ($action == "who"){
    if (ISSET($_SESSION['login']))
    {
        echo $_SESSION['login'];
    }
}


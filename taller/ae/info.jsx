(function () {
    var out = [];
    out.push("version=" + app.version);
    out.push("proyecto=" + (app.project.file ? app.project.file.fsName : "sin guardar"));
    out.push("items=" + app.project.numItems);
    try { out.push("seguridad=" + app.preferences.getPrefAsLong("Main Pref Section", "Pref_SCRIPTING_FILE_NETWORK_SECURITY")); } catch (e) { out.push("seguridad=err " + e.toString()); }
    try {
        var f = new File("/Users/luiyi/Videos-Remotion/ae/resultado.txt");
        f.open("w"); f.write(out.join("\n")); f.close();
    } catch (e2) { return "write-fail: " + e2.toString(); }
    return "ok";
})();

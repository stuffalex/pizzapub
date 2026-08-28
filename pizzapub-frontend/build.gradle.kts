plugins {
    base
}

val isWindows = System.getProperty("os.name").lowercase().contains("windows")
val npmCommand = if (isWindows) "npm.cmd" else "npm"

val npmInstall = tasks.register<Exec>("npmInstall") {
    workingDir = file(".")
    commandLine(npmCommand, "install")
    inputs.file("package.json")
    outputs.dir("node_modules")
}

val npmBuild = tasks.register<Exec>("npmBuild") {
    dependsOn(npmInstall)
    workingDir = file(".")
    environment("NODE_OPTIONS", "--max_old_space_size=512")
    commandLine(npmCommand, "run", "build")
    inputs.dir("src")
    inputs.file("package.json")
    inputs.file("vite.config.ts")
    outputs.dir("dist")
}

tasks.named("build") {
    dependsOn(npmBuild)
}

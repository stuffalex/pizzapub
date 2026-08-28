rootProject.name = "pizzapub"

include("menu")
project(":menu").projectDir = file("pizzapub-menu")

include("panel")
project(":panel").projectDir = file("pizzapub-panel")

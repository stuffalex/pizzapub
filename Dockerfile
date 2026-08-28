# Estágio 1: Build
FROM eclipse-temurin:25-jdk AS builder
WORKDIR /app

# Copiar os arquivos do Gradle primeiro para aproveitar o cache do Docker
COPY gradle/ gradle/
COPY gradlew .
COPY build.gradle.kts settings.gradle.kts ./

# Dar permissão de execução para o gradlew
RUN chmod +x gradlew

# Copiar o código fonte e fazer o build
COPY src/ src/
RUN ./gradlew bootJar --no-daemon

# Estágio 2: Run (Imagem mais leve apenas com o JRE)
FROM eclipse-temurin:25-jre
WORKDIR /app

# Copiar o arquivo .jar gerado no estágio anterior
COPY --from=builder /app/build/libs/*SNAPSHOT.jar app.jar

# Expor a porta que a API vai rodar
EXPOSE 8080

# Comando para rodar a aplicação
ENTRYPOINT ["java", "-jar", "app.jar"]

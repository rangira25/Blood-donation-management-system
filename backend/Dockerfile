# Start from an OpenJDK base image
FROM eclipse-temurin:17-jdk-alpine

# Set the working directory
WORKDIR /app

# Copy Maven wrapper and project files
COPY . .

# Build the project
RUN ./mvnw clean package -DskipTests

# Run the JAR file
CMD ["java", "-jar", "target/*.jar"]

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public class StaticFileHandler implements HttpHandler {

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String path = exchange.getRequestURI().getPath();
        
        // Remove o prefixo /img/ e pega o nome do arquivo
        String fileName = path.substring(path.lastIndexOf("/") + 1);
        
        String projectDir = System.getProperty("user.dir");
        
        // Lista de caminhos possíveis para tentar
        Path[] possiblePaths = {
            Paths.get(projectDir, "img", fileName),                           // ./img/
            Paths.get(projectDir, "projeto_base", "img", fileName),           // ./projeto_base/img/
            Paths.get(projectDir, "..", "projeto_base", "img", fileName),     // ../projeto_base/img/
            Paths.get("img", fileName)                                         // img/ relativo
        };
        
        File file = null;
        Path filePath = null;
        
        for (Path tryPath : possiblePaths) {
            File tryFile = tryPath.normalize().toFile();
            if (tryFile.exists() && tryFile.isFile()) {
                file = tryFile;
                filePath = tryPath.normalize();
                break;
            }
        }
        
        if (file == null || !file.exists() || !file.isFile()) {
            String response = "404 - File not found: " + fileName + "\nWorking dir: " + projectDir + "\nTried paths:\n";
            for (Path p : possiblePaths) {
                response += "  - " + p.normalize().toAbsolutePath() + "\n";
            }
            exchange.sendResponseHeaders(404, response.length());
            exchange.getResponseBody().write(response.getBytes());
            exchange.getResponseBody().close();
            return;
        }
        
        // Detecta o tipo MIME
        String contentType = Files.probeContentType(filePath);
        if (contentType == null) {
            if (fileName.toLowerCase().endsWith(".jpg") || fileName.toLowerCase().endsWith(".jpeg")) {
                contentType = "image/jpeg";
            } else if (fileName.toLowerCase().endsWith(".png")) {
                contentType = "image/png";
            } else {
                contentType = "application/octet-stream";
            }
        }
        
        byte[] fileBytes = Files.readAllBytes(filePath);
        exchange.getResponseHeaders().set("Content-Type", contentType);
        exchange.getResponseHeaders().set("Cache-Control", "public, max-age=86400");
        exchange.sendResponseHeaders(200, fileBytes.length);
        exchange.getResponseBody().write(fileBytes);
        exchange.getResponseBody().close();
    }
}

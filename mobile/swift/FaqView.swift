import SwiftUI
import Foundation

struct FaqResponse: Codable {
    let answer: String
    let matches: [Match]
}

struct Match: Codable {
    let text: String
    let score: Double
}

struct FaqView: View {
    @State private var query = ""
    @State private var result = ""
    @State private var isLoading = false
    
    var body: some View {
        VStack(spacing: 20) {
            Text("Mediphant FAQ")
                .font(.title)
                .padding()
            
            TextField("Enter your question", text: $query)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .padding(.horizontal)
            
            Button("Search") {
                fetchFaq()
            }
            .disabled(query.isEmpty || isLoading)
            .padding()
            
            if isLoading {
                ProgressView()
            }
            
            ScrollView {
                Text(result)
                    .padding()
                    .frame(maxWidth: .infinity, alignment: .leading)
            }
            
            Spacer()
        }
        .padding()
    }
    
    private func fetchFaq() {
        guard !query.isEmpty else { return }
        
        isLoading = true
        result = ""
        
        let encodedQuery = query.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? ""
        let urlString = "http://localhost:3000/api/faq?q=\(encodedQuery)"
        
        guard let url = URL(string: urlString) else {
            result = "Invalid URL"
            isLoading = false
            return
        }
        
        URLSession.shared.dataTask(with: url) { data, response, error in
            DispatchQueue.main.async {
                isLoading = false
                
                if let error = error {
                    result = "Error: \(error.localizedDescription)"
                    return
                }
                
                guard let data = data else {
                    result = "No data received"
                    return
                }
                
                do {
                    let faqResponse = try JSONDecoder().decode(FaqResponse.self, from: data)
                    result = formatResponse(faqResponse)
                } catch {
                    result = "Failed to parse response: \(error.localizedDescription)"
                }
            }
        }.resume()
    }
    
    private func formatResponse(_ response: FaqResponse) -> String {
        var formatted = "Answer: \(response.answer)\n\nMatches:\n"
        for (index, match) in response.matches.enumerated() {
            formatted += "\n\(index + 1). \(match.text)\n   Score: \(String(format: "%.2f", match.score))\n"
        }
        return formatted
    }
}

struct FaqView_Previews: PreviewProvider {
    static var previews: some View {
        FaqView()
    }
}
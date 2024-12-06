
# File Processor API

This project provides a RESTful API for processing and managing files. It enables users to upload a CSV file, extract file references from the CSV, and move corresponding image files from a source directory to a target directory. Additionally, it provides real-time feedback on the operation, including moved and missing files.

---

## Features

- Upload a CSV file containing references to image files.
- Process the CSV file to extract file names and match them with files in a specified source directory.
- Move matched files to a target directory.
- Return a JSON response summarizing the operation:
  - Number of files moved.
  - List of moved files.
  - Number of files not found.
  - List of missing files.
- Handles CORS to enable cross-origin requests from frontend applications.

---

## Prerequisites

- **Node.js**: Ensure you have Node.js installed on your system.
- **NPM**: The Node Package Manager, which is included with Node.js.

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/file-processor-api.git
   ```

2. Navigate to the project directory:
   ```bash
   cd file-processor-api
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

---

## Usage

### Starting the Server
Run the following command to start the server:
```bash
node server.js
```
The server will be accessible at `http://localhost:5000`.

---

### API Endpoints

#### **1. Upload CSV File**

- **URL**: `/upload`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data`
- **Description**: Uploads a CSV file containing references to image files and processes them.

##### **Request Parameters**
| Field            | Type          | Description                                          |
|-------------------|---------------|------------------------------------------------------|
| `excelFile`       | `file`        | The CSV file containing references to images.       |
| `sourceDirectory` | `string`      | The directory path where the referenced images are stored. |

##### **Example Request**
Using `curl`:
```bash
curl -X POST http://localhost:5000/upload \
  -F "excelFile=@/path/to/your-file.csv" \
  -F "sourceDirectory=C:/Users/krgar/Downloads/Data/Data/Images"
```

##### **Response Example**
```json
{
  "message": "File processed successfully",
  "movedCount": 5,
  "notFoundCount": 2,
  "movedImages": ["1500.jpg", "1501.jpg", "1502.jpg", "1503.jpg", "1504.jpg"],
  "notFoundImages": ["1505.jpg", "1506.jpg"]
}
```

---

### Error Handling

The API returns appropriate error messages and HTTP status codes for different scenarios:
- `400`: Missing required fields (e.g., no file uploaded).
- `500`: Internal server errors (e.g., file read/write errors).

---

## Directory Structure

- **`uploads/`**: Stores uploaded CSV files temporarily.
- **`images/`**: Target directory for moved image files.
- **`sourceDirectory`**: (User-specified) Directory containing the source image files.

---

## Implementation Details

### Technologies Used

- **Express.js**: Backend framework for creating the RESTful API.
- **Multer**: Middleware for handling file uploads.
- **csv-parser**: Library for reading and parsing CSV files.
- **CORS**: Middleware to enable cross-origin requests.

### Workflow

1. **File Upload**:
   - CSV files are uploaded to the `uploads/` directory.
   - The API extracts file references (image paths) from the CSV.

2. **File Processing**:
   - Each image filename is checked against the `sourceDirectory`.
   - Files found in the `sourceDirectory` are moved to the `images/` directory.
   - Files not found are tracked for the response.

3. **Response**:
   - The API returns a summary of moved and missing files in JSON format.

---

## Configuration

### Source and Target Directories
- **Source Directory**: 
  - Specified by the `sourceDirectory` parameter in the API request.
- **Target Directory**:
  - Default: `./images`
  - Ensure the directory exists or is created at runtime.

### CORS Setup
CORS is enabled to allow cross-origin requests, making the API accessible from frontend applications hosted on different domains.

---

## Future Enhancements

- Add authentication to secure the API.
- Support bulk upload and concurrent file processing.
- Provide detailed logs and downloadable reports of the operation.

---

## License

This project is licensed under the [MIT License](LICENSE).

--- 

## Contribution

Contributions are welcome! Please fork the repository, create a new branch, and submit a pull request with your changes.

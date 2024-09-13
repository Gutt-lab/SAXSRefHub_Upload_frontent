import { useState, useRef } from "react";
import "./file_uploader.css";

export const FileUploader = ({ onSuccess }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");

  // Refs for form fields
  const facility = useRef();
  const beamLine = useRef();
  const measurementTechnique = useRef();
  const experimentProposalId = useRef();
  const dataSetName = useRef();
  const sampleInformation = useRef();
  const detector = useRef();
  const sampleDetectorDistance = useRef();
  const beamEnergy = useRef();
  const pixelSize = useRef();
  const description = useRef();

  const onInputChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      setError("No file selected.");
      return;
    }

    const validTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "text/plain",
    ];
    if (!validTypes.includes(selectedFile.type)) {
      setError(
        "Invalid file type. Please upload a PDF, JPG, PNG, or TXT file."
      );
      return;
    }

    const maxSizeInBytes = 50 * 1024 * 1024; // 50MB
    if (selectedFile.size > maxSizeInBytes) {
      setError("File size exceeds 50MB. Please upload a smaller file.");
      return;
    }

    setFile(selectedFile);
    setError(""); // Clear previous errors
    setUploadStatus(""); // Clear upload status
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      // Display an error message if no file is selected
      setError("Please upload a file before submitting.");
      return;
    }

    const data = new FormData();
    data.append("file", file);
    data.append("facility", facility.current.value);
    data.append("beam_line", beamLine.current.value);
    data.append("measurement_technique", measurementTechnique.current.value);
    data.append("experiment_proposalId", experimentProposalId.current.value);
    data.append("data_set_name", dataSetName.current.value);
    data.append("sample_information", sampleInformation.current.value);
    data.append("detector", detector.current.value);
    data.append(
      "sample_detector_distance",
      sampleDetectorDistance.current.value
    );
    data.append("beam_energy", beamEnergy.current.value);
    data.append("pixel_size", pixelSize.current.value);
    data.append("description", description.current.value);

    try {
      //const SERVER_URL = "http://141.99.126.94:5000/api/upload";
      const SERVER_URL = "http://localhost:3002/upload";

      const response = await fetch(SERVER_URL, {
        method: "POST",
        body: data,
        headers: {},
      });

      if (response.ok) {
        setError("");
        setUploadStatus("File uploaded successfully!");

        // Clear the form data and file input
        setFile(null);
        facility.current.value = "";
        beamLine.current.value = "";
        measurementTechnique.current.value = "";
        experimentProposalId.current.value = "";
        dataSetName.current.value = "";
        sampleInformation.current.value = "";
        detector.current.value = "";
        sampleDetectorDistance.current.value = "";
        beamEnergy.current.value = "";
        pixelSize.current.value = "";
        description.current.value = "";

        // Reset the file input by setting its value to an empty string
        document.getElementById("upload").value = "";

        // Optional: Hide the success message after a few seconds
        setTimeout(() => {
          setUploadStatus("");
        }, 3000);
      } else {
        setError(
          "Failed to upload the file. Server returned an unexpected status."
        );
      }
    } catch (err) {
      console.error("Error uploading file: ", err);
      setError("Failed to upload the file. Please try again.");
    }
  };

  return (
    <div>
      <form method="post" action="#" id="#" onSubmit={onSubmit}>
        {/* File Upload at the Top */}
        <div className="form-group files">
          <label className="input-label" htmlFor="file-upload">
            Upload Your File
          </label>
          <input
            id="upload"
            type="file"
            accept=".pdf, .jpg, .jpeg, .png, .txt"
            onChange={onInputChange} // send event
            className="form-control"
            multiple={false} //to upload only one
          />
        </div>

        {/* Error message if any */}
        {error && <p className="error-message">{error}</p>}

        {/* Success message if uploaded */}
        {uploadStatus && <p className="upload-status">{uploadStatus}</p>}

        <div className="form-container">
          {/* Required Fields Section */}
          <div className="form-column required-fields">
            <h2>Required Metadata</h2>
            <label>Facility</label>
            <input type="text" ref={facility} required />
            <label>Beamline</label>
            <input type="text" ref={beamLine} required />
            <label>Measurement Technique</label>
            <input type="text" ref={measurementTechnique} required />
            <label>Experiment Proposal ID</label>
            <input type="text" ref={experimentProposalId} required />
            <label>Data Set Name</label>
            <input type="text" ref={dataSetName} required />
            <label>Sample Information</label>
            <textarea ref={sampleInformation} required />
          </div>

          {/* Optional Fields Section */}
          <div className="form-column optional-fields">
            <h3>Optional Information</h3>
            <label>Detector</label>
            <input type="text" ref={detector} />
            <label>Sample Detector Distance</label>
            <input type="text" ref={sampleDetectorDistance} />
            <label>Beam Energy</label>
            <input type="text" ref={beamEnergy} />
            <label>Pixel Size</label>
            <input type="text" ref={pixelSize} />
            <label>Description / Further Information</label>
            <textarea ref={description} />
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

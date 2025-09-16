import React, { useState, useRef } from 'react';
import { Cloud, Upload, Folder, Info, X } from 'lucide-react';

const DocumentDownload = () => {
     const [uploadedFiles, setUploadedFiles] = useState([]);
      const [isDragOver, setIsDragOver] = useState(false);
      const fileInputRef = useRef(null);
      
      const documentTypes = [
        'Srini Aadhar Card',
        'Pan Card',
        'Driving License(if required for role)',
        'Educational Certificate',
        'Bank Pass Book'
      ];
    
      const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
      };
    
      const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragOver(false);
      };
    
      const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        const files = Array.from(e.dataTransfer.files);
        setUploadedFiles(prev => [...prev, ...files]);
      };
    
      const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        setUploadedFiles(prev => [...prev, ...files]);
      };
    
      const handleBrowseClick = () => {
        fileInputRef.current?.click();
      };
    
      const handleDeleteFile = (index) => {
        setUploadedFiles(prev => prev.filter((_, i) => i !== index));
      };
    
      const handleDeleteAll = () => {
        setUploadedFiles([]);
      };
    
      const handleUpload = () => {
        console.log('Uploading files:', uploadedFiles);
        // Handle upload logic here
      };
    
      const handleSubmit = () => {
        console.log('Submitting documents');
        // Handle submit logic here
      };
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Upload Section */}
            <div className="lg:col-span-2">
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                  isDragOver
                    ? 'border-blue-400 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
                    <Cloud className="w-10 h-10 text-blue-500" />
                    <Upload className="w-6 h-6 text-blue-600 ml-1 -mt-2" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Drag & Drop here
                  </h3>
                </div>

                {/* Uploaded Files */}
                {uploadedFiles.length > 0 && (
                  <div className="mb-6">
                    <div className="bg-gray-50 rounded-lg p-4 max-h-32 overflow-y-auto">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between py-2">
                          <span className="text-sm text-gray-700 truncate">{file.name}</span>
                          <button
                            onClick={() => handleDeleteFile(index)}
                            className="text-red-500 hover:text-red-700 ml-2"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                  <button
                    onClick={handleDeleteAll}
                    disabled={uploadedFiles.length === 0}
                    className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Delete
                  </button>
                  <span className="text-gray-500 text-sm">Or</span>
                  <button
                    onClick={handleUpload}
                    disabled={uploadedFiles.length === 0}
                    className="px-8 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Upload
                  </button>
                </div>

                {/* Browse Button */}
                <div>
                  <button
                    onClick={handleBrowseClick}
                    className="text-orange-600 hover:text-orange-700 font-medium underline transition-colors"
                  >
                    Browse Your Device
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {/* Documents List */}
            <div className="lg:col-span-1">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Documents Upload Here
                </h3>
                <div className="w-12 h-1 bg-orange-600 rounded"></div>
              </div>

              <div className="space-y-4">
                {documentTypes.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center">
                      <Folder className="w-5 h-5 text-orange-500 mr-3" />
                      <span className="text-sm font-medium text-gray-700">{doc}</span>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                      <Info className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-8">
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
            >
              Submit
            </button>
          </div>
        </div>
  )
}

export default DocumentDownload

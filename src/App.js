import React from 'react';

import CSVReader from "react-csv-reader";
import { saveAs } from 'file-saver';

import Table from './components/Table';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileData: null,
      preview: null,
      output: null
    };
  }

  handleFileSelection = (type, data) => {
    const fileData = this.state.fileData || {};
    fileData[type] = data;
    this.setState({ fileData: fileData });
  }

  createRequestOptions() {
    const myHeaders = new Headers();

    const formdata = new FormData();
    formdata.append("myfile", document.getElementById('WORKDAY').files[0]);
    formdata.append("myfile", document.getElementById('ALIGHT').files[0]);
    formdata.append("type", "WORKDAY,ALIGHT");

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      responseType: 'blob'
    };

    return requestOptions;
  }

  compareFiles = () => {
    this.setState({preview: null});
    fetch("http://localhost:3000/upload", this.createRequestOptions())
      .then(response => response.json())
      .then(result => this.setState({ output: result }))
      .catch(error => console.log('error', error));
  }

  exportFile = () => {
    fetch("http://localhost:3000/upload/export",  this.createRequestOptions())
      .then(response => response.blob())
      .then(blob => saveAs(blob, 'output.xlsx'))
      .catch(error => console.log('error', error));
  }

  showPreview = type => {
    this.setState({
      preview: {
        header: Object.keys(this.state.fileData[type][0]),
        data: this.state.fileData[type]
      }
    });
  }


  render() {
    const parseOptions = {
      header: true
    };
    return (
      <div className="container">
        <div className="csv-input-upload">
          <CSVReader
            label="Workday CSV File"
            inputId="WORKDAY"
            onFileLoaded={(data, fileInfo) => this.handleFileSelection('WORKDAY', data, fileInfo)}
            parserOptions={parseOptions}
          />
          {this.state.fileData && this.state.fileData.WORKDAY ? <button className="button button-secondary" onClick={() => this.showPreview('WORKDAY')}>Show Preview</button> : null}
        </div>
        <div className="csv-input-upload">
          <CSVReader
            label="Alight CSV File"
            inputId="ALIGHT"
            onFileLoaded={(data, fileInfo) => { this.handleFileSelection('ALIGHT', data, fileInfo) }}
            parserOptions={parseOptions}
          />
          {this.state.fileData && this.state.fileData.ALIGHT ? <button className="button button-secondary" onClick={() => this.showPreview('ALIGHT')}>Show Preview</button> : null}
        </div>
        {this.state.fileData && this.state.fileData.WORKDAY && this.state.fileData.ALIGHT ? (
          <div>
            <button className="button" onClick={this.compareFiles}>Compare Files</button>
            <button className="button" onClick={this.exportFile}>Export</button>
          </div>
          ) : null}
        {this.state.preview ? <Table tableData={this.state.preview} /> : null}
        {this.state.output && this.state.output.WORKDAY ? <Table tableData={this.state.output.WORKDAY} /> : null}
        {this.state.output && this.state.output.ALIGHT ? <Table tableData={this.state.output.ALIGHT} /> : null}
      </div>
    );
  }
}

export default App;

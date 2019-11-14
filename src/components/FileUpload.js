import React, { Fragment, useState } from 'react'
import Message from './Message'


const FileUpload = () => {
  const [file, setFile] = useState('')
  const [filename, setFilename] = useState('Selecteer Bestand')
  const [tableArray, setTableArray] = useState([])
  const [message, setMessage] = useState('')
  const [sortTypeFirstName, setSortTypeFirstName] = useState('ascending')
  const [sortTypeSurName, setSortTypeSurName] = useState('descending')
  const [sortTypeIssueCount, setSortTypeIssueCount] = useState('ascending')
  const [sortTypeDateOfBirth, setSortTypeDateOfBirth] = useState('ascending')


  const onChange = e => {
    setFile(e.target.files[0])
    setFilename(e.target.files[0].name)
  };

  const onSubmit = e => {
    e.preventDefault()

    if (file !== '') {
      setMessage('File Uploaded')
      getAsText(file)
    }
    else {
      setMessage('No File Uploaded')
    }
  };

  const getAsText = fileToRead => {
    let reader = new FileReader()
    reader.readAsText(fileToRead)
    reader.onload = loadHandler
    reader.onerror = errorHandler
  }

  const loadHandler = e => {
    let csv = e.target.result
    processData(csv)
  }

  const errorHandler = e => {
    if (e.target.error.name === 'NotReadableError') {
      setMessage('Cannot Read File')
    }
  }

  const processData = csv => {
    let finalArr = []
    let allTextLines = csv.split('\r\n')

    for (let i = 0; i < allTextLines.length; i++) {
      let row = allTextLines[i].split(';')
      let col = []

      for (let j = 0; j < row.length; j++) {
        col.push(row[j])
      }
      finalArr.push(col)
    }

    const headers = finalArr[0]
    const arrayRowsToSort = finalArr.splice(1)
    let sortedArrayRows

    sortedArrayRows = arrayRowsToSort.sort((a, b) => {
      if (a[1] < b[1]) {
        return -1
      } else if (a[1] > b[1]) {
        return 1
      } else {
        return 0
      }
    })

    finalArr = [headers].concat(sortedArrayRows)
    setTableArray(finalArr)
  }

  const onClick = sortBy => {
    const headers = tableArray[0]
    const arrayRowsToSort = tableArray.splice(1)
    let sortedArrayRows
    let sortedArray

    if (sortBy === 'issue_count') {
      if (sortTypeIssueCount === 'ascending') {
        sortedArrayRows = arrayRowsToSort.sort((a, b) => a[2] - b[2])
        setSortTypeIssueCount('descending')
      } else {
        sortedArrayRows = arrayRowsToSort.sort((a, b) => b[2] - a[2])
        setSortTypeIssueCount('ascending')
      }
    } else if (sortBy === 'sur_name') {
      if (sortTypeSurName === 'ascending') {
        sortedArrayRows = arrayRowsToSort.sort((a, b) => {
          if (a[1] < b[1]) {
            return -1
          } else if (a[1] > b[1]) {
            return 1
          } else {
            return 0
          }
        })
        setSortTypeSurName('descending')
      } else {
        sortedArrayRows = arrayRowsToSort.sort((a, b) => {
          if (a[1] > b[1]) {
            return -1
          } else if (a[1] < b[1]) {
            return 1
          } else {
            return 0
          }
        })
        setSortTypeSurName('ascending')
      }
    } else if (sortBy === 'first_name') {
      if (sortTypeFirstName === 'ascending') {
        sortedArrayRows = arrayRowsToSort.sort((a, b) => {
          if (a[0] < b[0]) {
            return -1
          } else if (a[0] > b[0]) {
            return 1
          } else {
            return 0
          }
        })
        setSortTypeFirstName('descending')
      } else {
        sortedArrayRows = arrayRowsToSort.sort((a, b) => {
          if (a[0] > b[0]) {
            return -1
          } else if (a[0] < b[0]) {
            return 1
          } else {
            return 0
          }
        })
        setSortTypeFirstName('ascending')
      }
    } else if (sortBy === 'date_of_birth') {
      if (sortTypeDateOfBirth === 'ascending') {
        sortedArrayRows = arrayRowsToSort.sort((a, b) => {
          return new Date(b[3]) - new Date(a[3])
        })
        setSortTypeDateOfBirth('descending')
      } else {
        sortedArrayRows = arrayRowsToSort.sort((a, b) => {
          return new Date(a[3]) - new Date(b[3])
        })
        setSortTypeDateOfBirth('ascending')
      }
    }

    sortedArray = [headers].concat(sortedArrayRows)
    setTableArray(sortedArray)
  }


  return (
    <Fragment>
      {message ? <Message msg={message} /> : null}
      <form onSubmit={onSubmit} className="mb-4">
        <div className='custom-file mb-4'>
          <input
            type='file'
            className='custom-file-input'
            id='customFile'
            onChange={onChange}
          />
          <label className='custom-file-label' htmlFor='customFile'>
            {filename}
          </label>
        </div>
        <input
          type='submit'
          value='Upload'
          className='btn btn-primary btn-block mt-4'
        />
      </form>
      {tableArray.length !== 0
        ? <table className="table">
          <thead>
            <tr>
              {tableArray[0].map(header => {
                return (
                  <th onClick={() => onClick(header)} scope='col'>
                    {header}
                  </th>)
              })}
            </tr>
          </thead>
          <tbody>
            {tableArray.slice(1).map(row => {
              return (
                <tr>
                  {row.map(rowData => <td>{rowData}</td>)}
                </tr>
              )
            })
            }
          </tbody>
        </table>
        : null}
    </Fragment>
  )
}

export default FileUpload
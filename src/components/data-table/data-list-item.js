import React from "react";
import { useTable, useFilters, usePagination } from "react-table";
import BTable from 'react-bootstrap/Table';
import { FormGroup, Label, Input, Row, Col } from 'reactstrap'

export default function Table({ columns, data, size }) {
  // Use the useTable Hook to send the columns and data to build the table
  const {
    getTableProps, // table props from react-table
    getTableBodyProps, // table body props from react-table
    headerGroups, // headerGroups, if your table has groupings
    // rows, // rows for the table based on the data passed
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    // pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    // Prepare the row (this function needs to be called for each row before getting the row props)
    setFilter,
    state: { pageIndex, pageSize },
  } = useTable({
    columns,
    data,
    initialState: { pageIndex: 0, pageSize: size,
      // hiddenColumns: ["hna"]
     },
    //   initialState: {
    //     hiddenColumns: columns.map(column => {
    //         if (column.show === false) return column.accessor || column.id;
    //     }),
    // },
  },
    useFilters, usePagination);
  /* 
    Render the UI for your table
    - react-table doesn't have UI, it's headless. We just need to put the react-table props from the Hooks, and it will do its magic automatically
  */
  return (
    <>
      <FormGroup >
        <Row>
          <Col xs={6}>
            <Label for="item_code">Kode Barang</Label>
            <Input type="text" placeholder="Kode Barang" onChange={(e) => setFilter("item_code", e.target.value)} />
          </Col>
          <Col xs={6}>
            <Label for="no_order">Nama Barang</Label>
            <Input type="text" onChange={(e) => setFilter("items_name", e.target.value)} />
          </Col>
        </Row>
      </FormGroup>
      <BTable {...getTableProps()} responsive hover>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </BTable>
      <nav aria-label="Page navigation">
        <ul className="pagination">
          <li className="page-item">
            <button onClick={() => previousPage()} disabled={!canPreviousPage} className="page-link">
              {'Sebelum'}
            </button>
          </li>{' '}


          <li className="page-item">
            <span className="page-link" style={{ padding: '5px 5px' }}>
              Ke Halaman:{' '}
              <input
                type="number"
                defaultValue={pageIndex + 1}
                max={pageOptions.length}
                onChange={e => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0
                  gotoPage(page)
                }}
                style={{ width: '100px' }}
              />
            </span>
          </li>
          <li className="page-item">
            <select className="custom-select custom-select-sm"
              style={
                {
                  padding: '6px 20px 6px 0px',
                  height: '38px'
                }
              }
              value={pageSize}
              onChange={e => {
                setPageSize(Number(e.target.value))
              }}
            >
              {[5, 10, 20, 30, 40, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </li>
          <li className="page-item">
            <button onClick={() => nextPage()} disabled={!canNextPage} className="page-link">
              {'Selanjutnya'}
            </button>
          </li>
        </ul>
      </nav>
     
    </>
  );
}
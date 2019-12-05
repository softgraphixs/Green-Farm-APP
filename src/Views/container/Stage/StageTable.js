import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux'
import MUIDataTable from "mui-datatables";
import AddStages from './AddStages';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import {updateBreadcrumb} from '../../../actions/breadcrumbAction'
import axios from 'axios';
import { getStageRequest, getStageSuccess, getStageError } from "../../../actions/getStage.action";


const Styles = theme => ({
  root: {
    paddingTop: 50,
    marginLeft: 300,
    marginRight: 300,
  },
  tableWrapper: {
    maxHeight: 440,
    overflow: 'auto',
  },
});

class StageTable extends Component {
    
  constructor(props) {
    super(props);
    this.dispatch = props.dispatch
    this.state = {
      rowsPerPage: 5,
      datum: []
    }
}
componentDidMount =()=> {
    this.dispatch(updateBreadcrumb({parent: "Dashboard", child:"Stage"}))
    this.dispatch (getStageRequest())
    axios.get( 'https://bhfarmers.herokuapp.com/stages' )
    .then(data => {
       this.dispatch(getStageSuccess())
      this.setState({
        datum: data.data['stage']
      })
      console.log(this.state.datum,'datum')
    }).catch(error => {
      console.log(error)
      this.dispatch(getStageError(error))
      
    })
}
    getMuiTheme = () => createMuiTheme({
        overrides: {
            MUIDataTableHeadCell: {
                root: {
                  backgroundColor: "#008542",
                  fontWeight: 500,
                  textAlign: 'center',
      
                  '&:nth-child(1)': {
                    width: 2,
                  },
                  '&:nth-child(6)': {
                      width: 2,
                  }
                }
              }, 
          MUIDataTableToolbar: {
            root: {
              backgroundColor: "#008542",
            },
            titleText: {
                color:"white",
            },
            icon :{
              color:"white",
              '&:hover': {
                backgroundColor: "white",
                color: '#008542'
              }
            },
            iconActive: {
              color:"white",
            },
          },
        }
        
      })

render(){
  const columns = [{name: "sn", label: "S/N"},{name: 'name', label: "Name"},{name: 'date', label: "Date"}];
  const {datum} = this.state
  let data = []
 
  let i = 0
          if(datum !== null)
         datum.map((row) => {
        data.push({
          sn: i = i + 1,
          name: row.name,
          date: row.datecreated

        
        })
        console.log(row,'row')
    })

  const options = {
    responsive: "scroll",
    filterType: 'checkbox',
    viewColumns: false,
    selectableRows: 'none',
    rowsPerPageOptions: [5,10,15,20],
    rowsPerPage: this.state.rowsPerPage,
    responsive: 'scroll',
    filter: false,
    textLabels: {
        body: {
          noMatch: "Loading...",
      },
    },
    customToolbar: () => {
        return (
          <AddStages/>
        );
      },
  };

  const {classes} = this.props;

  return (
    <div className={classes.root}>
    <MuiThemeProvider theme={this.getMuiTheme()}>
      <MUIDataTable 
      title={"Stage List"} 
      data={data} 
      columns={columns} 
      options={options} 
      />
    </MuiThemeProvider>
    </div>
  );
}
}


export default connect()(withStyles(Styles, { withTheme: true })(StageTable));
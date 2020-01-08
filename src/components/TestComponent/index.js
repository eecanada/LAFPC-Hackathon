import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import HealthyData from './HealthyData';
import EditHealthy from './EditHealthy';
import HealthyChart from "./HealthyChart"
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';

import S from './style'

class TestComponent extends Component {

    state = {
        healthyData: [],
        showEditModal: false,
        showDataModal: false,
        dataModalProperty: '',
        editData: {
            _id: null,
            value: 'healthy',
            indicator: '',
            baseline: '',
            update: '',
            sources: '',
            change: '',
            notes: '',
            dataStatus: '',
            group: '',
            error: ''
        },
    }

    componentDidMount = () => {
        this.getData()
    }

    getData = async () => {
        try {
            const data = await fetch(`http://localhost:3030/data/get-data`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const oldData = await data.json()
            const healthData = oldData.data.filter(data => data.value === 'healthy')
            this.setState({
                healthyData: healthData
            })

        } catch (err) {
            console.log(err)
        }
    }

    addData = async (data) => {
        try {
            const addDataResponse = await fetch(`http://localhost:3030/data/add-data`, {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const parsedResponse = await addDataResponse.json()
            this.setState({
                healthyData: [...this.state.healthyData, parsedResponse.data]
            })
        } catch (err) {
            console.log(err, 'this is error from add data')
        }
    }

    handleFormChange = (e) => {
        this.setState({
            editData: {
                ...this.state.editData,
                [e.target.name]: e.target.value
            }
        })
    }

    closeAndEdit = async (e) => {
        e.preventDefault();
        try {
            const editRequest = await fetch(`http://localhost:3030/data/${this.state.editData._id}/update-data`, {
                method: 'PUT',
                credentials: 'include',
                body: JSON.stringify(this.state.editData),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (editRequest.status !== 200) {
                throw Error('editResquest not working')
            }
            const editResponse = await editRequest.json();
            const editDataArray = this.state.healthyData.map((data) => {
                if (data._id === editResponse.data._id) {
                    data = editResponse.data
                }
                return data
            });
            this.setState({
                healthyData: editDataArray,
                showEditModal: false
            })
            this.props.history.push('/healthy')
        } catch (err) {
            console.log(err, ' error closeAndEdit');
            return err
        }
    }

    editData = (data) => {
        this.setState({
            showEditModal: !this.showEditModal,
            editData: data
        })
    }

    cancelEdit = () => {
        this.setState({
            showEditModal: false
        })
    }

    delete = async (id) => {
        try {
            const deleteData = await fetch(`http://localhost:3030/data/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            if (deleteData.status !== 200) {
                throw Error('Something happend on delete')
            }
            const deleteDataJson = await deleteData.json();
            this.setState({
                healthyData: this.state.healthyData.filter((data) => data._id !== id)
            })
        } catch (err) {
            console.log(err);
            return err
        }
    }

    closeDataModal = () => {
        this.setState({
            showDataModal: false
        })
    }

    showData = e => {
        this.setState({
            showDataModal: !this.state.showDataModal,
            dataModalProperty: e.target.textContent
        })
    }

    render() {
        const { healthyData, editData, showEditModal, showDataModal, dataModalProperty } = this.state;
        const { isLogged } = this.props.isLogged
        return (
            <S.Container1>
                <S.DescribSec>
                    <h1>Healthy</h1>
                    <S.DescribPar>Food is integral to the health and quality of life of individuals and communities. Healthy food is nutritious, delicious and safe. Healthy food meets recommended dietary guidelines and supports the body’s ability to fight disease and heal. All people deserve access to healthy food that is affordable, conveniently availability and culturally relevant.</S.DescribPar>

                    <S.DescribPar>Not all communities live in neighborhoods where “the healthy choice is the easy choice,” and instead are surrounded by unhealthy food retail such as liquor stores, convenience stores and fast food restaurants. Through the numerous policy, systems and environmental changes led by stakeholders throughout the LAFPC network, we are collectively innovating solutions for overcoming systemic barriers to healthy food access— tailoring these innovations to the unique dynamics of the communities that we serve.</S.DescribPar>

                    <S.DescribPar>In this section, we explore progress towards improving the health of ALL Angelenos by evaluating disparities and change over time in the following categories: Increased healthy food access, Improved eating habits amongst adults & children, Rates of obesity, Rates of diet-related diseases.</S.DescribPar>
                </S.DescribSec>
                {
                    showEditModal
                        ?
                        <EditHealthy cancelEdit={this.cancelEdit} closeAndEdit={this.closeAndEdit} editData={editData} handleFormChange={this.handleFormChange} />
                        :
                        null
                }
                {
                    this.props.isLogged
                        ?
                        <HealthyData addData={this.addData} />
                        :
                        null
                }
                <S.Container2>
                    <S.DropDown>
                        <ExpansionPanel>
                            <ExpansionPanelSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                                >
                                <Typography >Store</Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <RadioGroup aria-label="gender" name="gender2">
                                {/* <FormControlLabel
                                    aria-label="Acknowledge"
                                    onClick={event => event.stopPropagation()}
                                    onFocus={event => event.stopPropagation()}
                                    control={<Radio color="primary" />}
                                    label="None"
                                />
                                <FormControlLabel
                                    aria-label="Acknowledge"
                                    onClick={event => event.stopPropagation()}
                                    onFocus={event => event.stopPropagation()}
                                    control={<Radio color="primary" />}
                                    label="None"
                                /> */}
                                
                                <FormControlLabel
                                    aria-label="Acknowledge"
                                    onClick={event => event.stopPropagation()}
                                    onFocus={event => event.stopPropagation()}
                                    control={<Checkbox />}
                                    label="Convenience"
                                />
                                <FormControlLabel
                                    aria-label="Acknowledge"
                                    onClick={event => event.stopPropagation()}
                                    onFocus={event => event.stopPropagation()}
                                    control={<Checkbox />}
                                    label="Grocery"
                                />
                                <FormControlLabel
                                    aria-label="Acknowledge"
                                    onClick={event => event.stopPropagation()}
                                    onFocus={event => event.stopPropagation()}
                                    control={<Checkbox />}
                                    label="Liquor"
                                />
                                {/* <FormControlLabel
                                    aria-label="Acknowledge"
                                    onClick={event => event.stopPropagation()}
                                    onFocus={event => event.stopPropagation()}
                                    control={<Checkbox />}
                                    label="None"
                                /> */}
                                

                                </RadioGroup>
                                
                                {/* <NativeSelect>
                                    
                                    <option value="">None</option>
                                    <option value={10}>Ten</option>
                                    <option value={20}>Twenty</option>
                                    <option value={30}>Thirty</option>
                                </NativeSelect> */}
                            </ExpansionPanelDetails>
                            

                            
                        </ExpansionPanel>

                        <ExpansionPanel>
                            <ExpansionPanelSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography >Source</Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <RadioGroup aria-label="gender" name="gender2">
                                    {/* <FormControlLabel
                                    aria-label="Acknowledge"
                                    onClick={event => event.stopPropagation()}
                                    onFocus={event => event.stopPropagation()}
                                    control={<Radio color="primary" />}
                                    label="None"
                                />
                                <FormControlLabel
                                    aria-label="Acknowledge"
                                    onClick={event => event.stopPropagation()}
                                    onFocus={event => event.stopPropagation()}
                                    control={<Radio color="primary" />}
                                    label="None"
                                /> */}

                                    <FormControlLabel
                                        aria-label="Acknowledge"
                                        onClick={event => event.stopPropagation()}
                                        onFocus={event => event.stopPropagation()}
                                        control={<Checkbox />}
                                        label="Convenience"
                                    />
                                    <FormControlLabel
                                        aria-label="Acknowledge"
                                        onClick={event => event.stopPropagation()}
                                        onFocus={event => event.stopPropagation()}
                                        control={<Checkbox />}
                                        label="Grocery"
                                    />
                                    <FormControlLabel
                                        aria-label="Acknowledge"
                                        onClick={event => event.stopPropagation()}
                                        onFocus={event => event.stopPropagation()}
                                        control={<Checkbox />}
                                        label="Liquor"
                                    />
                                    {/* <FormControlLabel
                                    aria-label="Acknowledge"
                                    onClick={event => event.stopPropagation()}
                                    onFocus={event => event.stopPropagation()}
                                    control={<Checkbox />}
                                    label="None"
                                /> */}


                                </RadioGroup>

                                {/* <NativeSelect>
                                    
                                    <option value="">None</option>
                                    <option value={10}>Ten</option>
                                    <option value={20}>Twenty</option>
                                    <option value={30}>Thirty</option>
                                </NativeSelect> */}
                            </ExpansionPanelDetails>



                        </ExpansionPanel>        

                        <ExpansionPanel>
                            <ExpansionPanelSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography >Payment</Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <RadioGroup aria-label="gender" name="gender2">
                                    {/* <FormControlLabel
                                    aria-label="Acknowledge"
                                    onClick={event => event.stopPropagation()}
                                    onFocus={event => event.stopPropagation()}
                                    control={<Radio color="primary" />}
                                    label="None"
                                />
                                <FormControlLabel
                                    aria-label="Acknowledge"
                                    onClick={event => event.stopPropagation()}
                                    onFocus={event => event.stopPropagation()}
                                    control={<Radio color="primary" />}
                                    label="None"
                                /> */}

                                    <FormControlLabel
                                        aria-label="Acknowledge"
                                        onClick={event => event.stopPropagation()}
                                        onFocus={event => event.stopPropagation()}
                                        control={<Checkbox />}
                                        label="Convenience"
                                    />
                                    <FormControlLabel
                                        aria-label="Acknowledge"
                                        onClick={event => event.stopPropagation()}
                                        onFocus={event => event.stopPropagation()}
                                        control={<Checkbox />}
                                        label="Grocery"
                                    />
                                    <FormControlLabel
                                        aria-label="Acknowledge"
                                        onClick={event => event.stopPropagation()}
                                        onFocus={event => event.stopPropagation()}
                                        control={<Checkbox />}
                                        label="Liquor"
                                    />
                                    {/* <FormControlLabel
                                    aria-label="Acknowledge"
                                    onClick={event => event.stopPropagation()}
                                    onFocus={event => event.stopPropagation()}
                                    control={<Checkbox />}
                                    label="None"
                                /> */}


                                </RadioGroup>

                                {/* <NativeSelect>
                                    
                                    <option value="">None</option>
                                    <option value={10}>Ten</option>
                                    <option value={20}>Twenty</option>
                                    <option value={30}>Thirty</option>
                                </NativeSelect> */}
                            </ExpansionPanelDetails>
                        </ExpansionPanel>   
                    </S.DropDown>
                    <div id="chart">
                        <HealthyChart 
                            options={this.state.options} 
                            series={this.state.series} 
                            type="bar" 
                            height={320}
                            width={600}
                        />
                    </div>
                </S.Container2>
            </S.Container1>
        )
    }
}

export default withRouter(TestComponent)
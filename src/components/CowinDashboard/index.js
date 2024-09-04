// Write your code here
import {Component} from 'react'
import Loader from 'react-loader-spinner'

import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByAge from '../VaccinationByAge'
import VaccinationByGender from '../VaccinationByGender'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class CowinDashboard extends Component {
  state = {
    coWinData: {},
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getCovidList()
  }

  getCovidList = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const apiUrl = 'https://apis.ccbp.in/covid-vaccination-data'
    const response = await fetch(apiUrl)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = {
        last7DaysVaccination: fetchedData.last_7_days_vaccination.map(each => ({
          vaccineDate: each.vaccine_date,
          dose1: each.dose_1,
          dose2: each.dose_2,
        })),
        vaccinationByAge: fetchedData.vaccination_by_age.map(each => ({
          age: each.age,
          count: each.count,
        })),
        vaccinationByGender: fetchedData.vaccination_by_gender.map(each => ({
          count: each.count,
          gender: each.gender,
        })),
      }
      this.setState({
        coWinData: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
      />
      <h1>Something went wrong</h1>
    </div>
  )

  renderLoader = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  renderStatusView = () => {
    const {coWinData} = this.state

    return (
      <>
        <VaccinationCoverage
          vaccinationCoverageData={coWinData.last7DaysVaccination}
        />
        <VaccinationByGender
          vaccinationGenderData={coWinData.vaccinationByGender}
        />
        <VaccinationByAge vaccinationAgeData={coWinData.vaccinationByAge} />
      </>
    )
  }

  renderBasedOnStatus = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderStatusView()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="bg-container">
        <div>
          <div className="icon-container">
            <img
              className="icon"
              src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
              alt="website logo"
            />
            <p className="dashboard-icon-name">Co-WIN</p>
          </div>
          <h1 className="dashboard-title">CoWIN Vaccination in India</h1>
          {this.renderBasedOnStatus()}
        </div>
      </div>
    )
  }
}

export default CowinDashboard

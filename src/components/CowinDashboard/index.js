// Write your code here
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import './index.css'
import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByAge from '../VaccinationByAge'

const isLoadingConstants = {
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
  failed: 'FAILED',
}

class CowinDashboard extends Component {
  state = {isLoading: isLoadingConstants.inProgress, vaccinationData: ''}

  componentDidMount() {
    this.getDetails()
  }

  getDetails = async () => {
    const vaccinationDataApiUrl = 'https://apis.ccbp.in/covid-vaccination-data'

    const response = await fetch(vaccinationDataApiUrl)
    if (response.ok === true) {
      const data = await response.json()
      console.log(data)

      const formattedData = {
        last7DaysVaccination: data.last_7_days_vaccination.map(eachData => ({
          vaccinationDate: eachData.vaccine_date,
          doseOne: eachData.dose_1,
          doseTwo: eachData.dose_2,
        })),
        vaccinationByAge: data.vaccination_by_age,
        vaccinationByGender: data.vaccination_by_gender,
      }
      this.setState({
        vaccinationData: formattedData,
        isLoading: isLoadingConstants.success,
      })
    } else {
      this.setState({isLoading: isLoadingConstants.failed})
    }
  }

  renderUi = () => {
    const {isLoading, vaccinationData} = this.state
    const {
      last7DaysVaccination,
      vaccinationByGender,
      vaccinationByAge,
    } = vaccinationData

    switch (isLoading) {
      case isLoadingConstants.success:
        return (
          <div>
            <VaccinationCoverage last7DaysVaccination={last7DaysVaccination} />
            <VaccinationByGender vaccinationByGender={vaccinationByGender} />
            <VaccinationByAge vaccinationByAge={vaccinationByAge} />
          </div>
        )

      case isLoadingConstants.inProgress:
        return (
          <div data-testid="loader" className="loader">
            <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
          </div>
        )

      default:
        return (
          <div className="chart-body">
            <img
              className="not-found-image"
              alt="failure view"
              src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
            />
            <h1 className="chart-heading">Something went wrong</h1>
          </div>
        )
    }
  }

  render() {
    return (
      <div className="app-bg">
        <div className="logo-and-title">
          <img
            className="logo"
            alt="website logo"
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png "
          />
          <h1 className="logo-title">Co-WIN</h1>
        </div>
        <h1 className="main-title">CoWIN Vaccination in India</h1>
        <div className="app-body">{this.renderUi()}</div>
      </div>
    )
  }
}
export default CowinDashboard

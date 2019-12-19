import { Component, ViewChild } from '@angular/core';
import { NavController, ToastController, LoadingController } from 'ionic-angular';
import { StatisticsProvider } from '../../providers/statistics/statistics';

// Import Chart.js
import { Chart } from 'chart.js';

@Component({
  selector: 'page-statistics',
  templateUrl: 'statistics.html'
})

export class StatisticsPage {

	doughnutNumberResults:any;
	lineTimeAverageResults:any;
	mediansByTimeBarChartResults:any;
	lowsBarChartResults:any;
	highsBarChartResults:any;

	bloodGlucoseResults:any;

	very_low_count: number;
	low_count: number;
	normal_count: number;
	high_count: number;
	very_high_count: number;

	average_week:number;
	average_month:number;
	average_three_month:number;

	breakfast_mean: number;
	lunch_mean: number;
	dinner_mean: number;
	bed_mean: number;

	breakfast_median: number;
	lunch_median: number;
	dinner_median: number;
	bed_median: number;

	breakfast_lows: number;
	lunch_lows: number;
	dinner_lows: number;
	bed_lows: number;
	
	breakfast_highs: number;
	lunch_highs: number;
	dinner_highs: number;
	bed_highs: number;

	errorToast: any;
    loadingSpinner:any;

    averages_loaded:boolean = false;
    by_level_loaded:boolean = false;
    average_by_time_loaded:boolean = false;
    lows_loaded:boolean = false;
    highs_loaded:boolean = false;
    medians_loaded:boolean = false;

	@ViewChild('bloodGlucoseCategoryDoughnut') bloodGlucoseCategoryDoughnut;
	@ViewChild('bloodGlucoseMeanTimeLine') bloodGlucoseMeanTimeLine;
	@ViewChild('mediansByMealBarChart') mediansByMealBarChart;
	@ViewChild('lowsByMealBarChart') lowsByMealBarChart;
	@ViewChild('highsByMealBarChart') highsByMealBarChart;

	constructor(public navCtrl: NavController, private loadingCtrl: LoadingController, private statisticsProvider: StatisticsProvider, private toastCtrl: ToastController) {
		// this.initialiseGraphs();
	}

	ionViewDidEnter(){
        this.resetLoadingStatus()
		this.initialiseGraphs();
    }
    
    resetLoadingStatus(){
        this.averages_loaded = false;
        this.by_level_loaded = false;
        this.average_by_time_loaded = false;
        this.lows_loaded = false;
        this.highs_loaded = false;
        this.medians_loaded = false;
    }

	hideSpinner(){
        if(typeof this.loadingSpinner !== 'undefined' && 
        this.averages_loaded && 
        this.by_level_loaded &&
        this.lows_loaded && 
        this.highs_loaded && 
        this.medians_loaded){
            this.loadingSpinner.dismiss();
        }
	}

	initialiseGraphs(){

        // Show the loading spinner
		this.loadingSpinner = this.loadingCtrl.create({
			content: "Loading..."
        });

        this.loadingSpinner.present();
		
		// Get the averages for the top bar
		this.statisticsProvider.get_averages()
		.subscribe(averages => {

            console.log(averages);
			// Do we have the averages?
			if (averages !== 'undefined') {
				this.average_week = averages['week'];
				this.average_month = averages['month'];
                this.average_three_month = averages['week'];
                
                this.averages_loaded = true;
			}

			this.hideSpinner();

		}, error => {
			this.handleStatsError(error);
		});

		// Get the blood glucose by category for the doughnut chart
		this.statisticsProvider.get_blood_glucose_by_level()
		.subscribe(results => {

			// Do we have any results?
			if (typeof results !== 'undefined') {

				// Initialise counts
				this.very_low_count = results['very_low'];
				this.low_count = results['low'];
				this.normal_count = results['normal'];
				this.high_count = results['high'];
				this.very_high_count = results['very_high'];

				// Do we have atleast 1 result?
				if(this.very_low_count > 0 || this.low_count > 0 || this.normal_count > 0 || this.high_count > 0 || this.very_high_count > 0){
					
					// Create doughnut chart
					this.doughnutNumberResults = new Chart(this.bloodGlucoseCategoryDoughnut.nativeElement, {
						type: 'doughnut',
						data: {
							labels: ["Very Low", "Low", "Good", "High", "Very High"],
							datasets: [{
								label: '# of Levels',
								data: [this.very_low_count, this.low_count, this.normal_count, this.high_count, this.very_high_count],
								backgroundColor: [
									'rgba(255, 159, 64, 0.2)',
									'rgba(255, 99, 132, 0.2)',
									'rgba(75, 192, 192, 0.2)',
									'rgba(255, 206, 86, 0.2)',
									'rgba(153, 102, 255, 0.2)',
									'rgba(255, 159, 64, 0.2)'
								],
								hoverBackgroundColor: [
									'rgba(255, 159, 64, 1)',
									'rgba(255, 99, 132, 1)',
									'rgba(75, 192, 192, 1)',
									'rgba(255, 206, 86, 1)',
									'rgba(153, 102, 255, 1)',
									'rgba(255, 159, 64, 1)'
								]
							}]
						}
					});
                    this.by_level_loaded = true;
                }
				this.hideSpinner();
			}
		}, error => {
			this.handleStatsError(error);
		});

		// Get averages by time for the line chart
		this.statisticsProvider.get_averages_by_time()
		.subscribe(results => {

			// Do we have any results?
			if (typeof results !== 'undefined') {

				// Initialise means
				this.breakfast_mean = results['breakfast_average'];
				this.lunch_mean = results['lunch_average'];
				this.dinner_mean = results['dinner_average'];
				this.bed_mean = results['bed_average'];

				// Create line chart
				this.lineTimeAverageResults = new Chart(this.bloodGlucoseMeanTimeLine.nativeElement, {
					type: 'line',
					data: {
						labels: ["Breakfast", "Lunch", "Dinner", "Bed"],
						datasets: [{
							label: "mmol/L",
							fill: false,
							lineTension: 0.1,
							backgroundColor: "rgba(75,192,192,0.4)",
							borderColor: "rgba(75,192,192,0.4)",
							borderCapStyle: 'butt',
							borderDash: [],
							borderDashOffset: 0.0,
							borderJoinStyle: 'miter',
							pointBorderColor: "rgba(75,192,192,1)",
							pointBackgroundColor: "#fff",
							pointBorderWidth: 1,
							pointHoverRadius: 5,
							pointHoverBackgroundColor: "rgba(75,192,192,1)",
							pointHoverBorderColor: "rgba(75,192,192,1)",
							pointHoverBorderWidth: 2,
							pointRadius: 1,
							pointHitRadius: 10,
							data: [this.breakfast_mean, this.lunch_mean, this.dinner_mean, this.bed_mean],
							spanGaps: false,
						}]
                    }
				});
                this.average_by_time_loaded = true;
				this.hideSpinner();
			}
		}, error => {
			this.handleStatsError(error);
		});

		// Get number of lows for the bar chart
		this.statisticsProvider.get_lows_by_meal()
		.subscribe(lows => {

			// Do we have any results?
			if (typeof lows !== 'undefined') {

				// Initialise the low counts
				this.breakfast_lows = lows['breakfast_lows'];
				this.lunch_lows = lows['lunch_lows'];
				this.dinner_lows = lows['dinner_lows'];
				this.bed_lows = lows['bed_lows'];

				// Create the bar chart
				this.lowsBarChartResults = new Chart(this.lowsByMealBarChart.nativeElement, {
					type: 'bar',
					data: {
						labels: ["Breakfast", "Lunch", "Dinner", "Bed"],
						datasets: [{
							label: 'Number of Lows',
							data: [this.breakfast_lows, this.lunch_lows, this.dinner_lows, this.bed_lows],
							backgroundColor: [
								'rgba(255, 99, 132, 0.2)',
								'rgba(54, 162, 235, 0.2)',
								'rgba(255, 206, 86, 0.2)',
								'rgba(75, 192, 192, 0.2)',
							],
							borderColor: [
								'rgba(255,99,132,1)',
								'rgba(54, 162, 235, 1)',
								'rgba(255, 206, 86, 1)',
								'rgba(75, 192, 192, 1)',
							],
							borderWidth: 1
						}]
					},
					options: {
						scales: {
							yAxes: [{
								ticks: {
									beginAtZero:true
								}
							}]
						}
					}
                });
                this.lows_loaded = true;
				this.hideSpinner();
			}
		}, error => {
			this.handleStatsError(error);
		});

		// Get number of highs for the bar chart
		this.statisticsProvider.get_highs_by_meal()
		.subscribe(highs => {

			// Do we have any results?
			if (typeof highs !== 'undefined') {

				// Initialise the low counts
				this.breakfast_highs = highs['breakfast_highs'];
				this.lunch_highs = highs['lunch_highs'];
				this.dinner_highs = highs['dinner_highs'];
				this.bed_highs = highs['bed_highs'];
			
				// Create the bar chart
				this.highsBarChartResults = new Chart(this.highsByMealBarChart.nativeElement, {
					type: 'bar',
					data: {
						labels: ["Breakfast", "Lunch", "Dinner", "Bed"],
						datasets: [{
							label: 'Number of Highs',
							data: [this.breakfast_highs, this.lunch_highs, this.dinner_highs, this.bed_highs],
							backgroundColor: [
								'rgba(255, 99, 132, 0.2)',
								'rgba(54, 162, 235, 0.2)',
								'rgba(255, 206, 86, 0.2)',
								'rgba(75, 192, 192, 0.2)',
							],
							borderColor: [
								'rgba(255,99,132,1)',
								'rgba(54, 162, 235, 1)',
								'rgba(255, 206, 86, 1)',
								'rgba(75, 192, 192, 1)',
							],
							borderWidth: 1
						}]
					},
					options: {
						scales: {
							yAxes: [{
								ticks: {
									beginAtZero:true
								}
							}]
						}
					}
                });
                this.highs_loaded = true;
				this.hideSpinner();
			}
		}, error => {
			this.handleStatsError(error);
		});
		
		// Get Median
		this.statisticsProvider.get_median_by_time()
		.subscribe(medians => {

			// Do we have any results?
			if (typeof medians !== 'undefined') {
			
				// Initialise the low counts
				this.breakfast_median = medians['breakfast_median'];
				this.lunch_median = medians['lunch_median'];
				this.dinner_median = medians['dinner_median'];
				this.bed_median = medians['bed_median'];
			
				// Create the bar chart
				this.mediansByTimeBarChartResults = new Chart(this.mediansByMealBarChart.nativeElement, {
					type: 'bar',
					data: {
						labels: ["Breakfast", "Lunch", "Dinner", "Bed"],
						datasets: [{
							label: 'mmol/L',
							data: [this.breakfast_median, this.lunch_median, this.dinner_median, this.bed_median],
							backgroundColor: [
								'rgba(255, 99, 132, 0.2)',
								'rgba(54, 162, 235, 0.2)',
								'rgba(255, 206, 86, 0.2)',
								'rgba(75, 192, 192, 0.2)',
							],
							borderColor: [
								'rgba(255,99,132,1)',
								'rgba(54, 162, 235, 1)',
								'rgba(255, 206, 86, 1)',
								'rgba(75, 192, 192, 1)',
							],
							borderWidth: 1
						}]
					},
					options: {
						scales: {
							yAxes: [{
								ticks: {
									beginAtZero:true
								}
							}]
						}
					}
                });
                this.medians_loaded = true;
				this.hideSpinner();
			}
		}, error => {
			this.handleStatsError(error);
		});
	}

	handleStatsError(error){

		// If there's no toast message already then show one
		if(!this.errorToast){

			// Show an error toast
			this.errorToast = this.toastCtrl.create({
				message: "Sorry, but there's been an error getting your statistics.",
				duration: 3000,
				position: 'top'
            });
			
			this.errorToast.present();
			this.hideSpinner();
		}
		

	}
}

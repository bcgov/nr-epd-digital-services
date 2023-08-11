#!/bin/bash

main() {

	# Make sure that this is being run from the scripts folder
	checkdirectory

	# Get user input for install instructions
	displayPrompts

	# Make sure all prompts have been answered
	# Checks if number of arguments = 5
	checkEmptyInput $is_from_registry $domain_name $namespace $is_premium $is_latest_release

	printf "\nInstalling forms flow ...\n"

	# Decide whether to install from formsflow registry (https://aot-technologies.github.io/forms-flow-ai-charts) or from this local repo
	configureInstall

	# Decide whether to use latest Chart release
	# The stable versions have been coded into this script, 
	# you can customize the versions that you would like to install by editing the versions within this function
	configureLatestOrStableReleases

	# Run helm install commands
	runHelmInstall

	printf "\nInstallation complete!\n"

}

runHelmInstall() {
	echo
	helm install forms-flow-ai $directory/forms-flow-ai --set Domain=$domain_name --set forms-flow-idm.keycloak.ingress.hostname=epd-keycloak-prod.apps.silver.devops.gov.bc.ca --namespace $namespace --version $version_ff_ai
	helm install forms-flow-analytics $directory/forms-flow-analytics --set Domain=$domain_name --namespace $namespace --version $version_ff_analytics
	helm install forms-flow-forms $directory/forms-flow-forms --set Domain=$domain_name --namespace $namespace --version $version_ff_forms
	#helm install forms-flow-idm $directory/forms-flow-idm --set Domain=$domain_name --set keycloak.ingress.hostname=forms-flow-idm-$namespace.$domain_name --namespace $namespace --version $version_ff_idm

	# if [[ $is_premium =~ ^[Yy]$ ]]; then
	# 	helm install forms-flow-admin $directory/forms-flow-admin --set Domain=$domain_name --namespace $namespace --version $version_ff_admin
	# fi

	helm install forms-flow-api $directory/forms-flow-api --set Domain=$domain_name --namespace $namespace --version $version_ff_api
	helm install forms-flow-bpm $directory/forms-flow-bpm --set Domain=$domain_name --set camunda.websocket.securityOrigin=https://forms-flow-web-e38158-prod.apps.silver.devops.gov.bc.ca --namespace $namespace --version $version_ff_bpm
	helm install forms-flow-data-analysis $directory/forms-flow-data-analysis --set Domain=$domain_name --namespace $namespace --version $version_ff_data_analysis
	helm install forms-flow-web $directory/forms-flow-web --set Domain=$domain_name --namespace $namespace --version $version_ff_web
	helm install forms-flow-documents-api $directory/forms-flow-documents-api --set Domain=$domain_name --namespace $namespace --version $version_ff_documents_api
}

configureInstall() {
	directory="../charts"
	if [[ $is_from_registry =~ ^[Yy]$ ]]; then
		addRegistry
		directory="formsflow"
	else
		updateLocalDependencies
	fi
}

configureLatestOrStableReleases() {
	if [[ $is_latest_release =~ ^[Yy]$ ]]; then
		version_ff_admin="latest"
		version_ff_ai="latest"
		version_ff_analytics="latest"
		version_ff_api="latest"
		version_ff_bpm="latest"
		version_ff_data_analysis="latest"
		version_ff_documents_api="latest"
		version_ff_forms="latest"
		version_ff_idm="latest"
		version_ff_web="latest"
	else
		# See https://github.com/AOT-Technologies/forms-flow-ai-charts/releases
		version_ff_admin="v2.1.1"
		version_ff_ai="v2.1.4"
		version_ff_analytics="v2.1.1"
		version_ff_api="v2.1.2"
		version_ff_bpm="v2.1.1"
		version_ff_data_analysis="v2.1.1"
		version_ff_documents_api="v2.1.1"
		version_ff_forms="v2.1.1"
		version_ff_idm="v2.1.2"
		version_ff_web="v2.1.1"
	fi
}

addRegistry() {
	helm repo remove formsflow
	helm repo add formsflow https://aot-technologies.github.io/forms-flow-ai-charts
	echo
	helm repo update formsflow
}

updateLocalDependencies(){
	helm dependency update $directory/forms-flow-ai/
	helm dependency update $directory/forms-flow-analytics/
	helm dependency update $directory/forms-flow-forms/
	helm dependency update $directory/forms-flow-idm/
	helm dependency update $directory/forms-flow-admin/
	helm dependency update $directory/forms-flow-api/
	helm dependency update $directory/forms-flow-bpm/
	helm dependency update $directory/forms-flow-data-analysis/
	helm dependency update $directory/forms-flow-web/
	helm dependency update $directory/forms-flow-documents-api/
}

displayPrompts() {
	read -p "Install using forms-flow package registry? (y/n):" is_from_registry
	read -p "Please enter the domain name (ex: apps.bronze.aot-technologies.com):" domain_name
	read -p "Please enter the namespace (ex: forms-flow):" namespace
	read -p "Is this a premium installation? (y/n):" is_premium
	read -p "Use the latest version release? (y) or stable release (n):" is_latest_release
}

checkdirectory() {
	pwd=$(pwd)
	dirname=$(basename ${pwd})
	if [ ! ${dirname} = "scripts" ]; then
		echo "Must run from scripts folder"
		exit 1
	fi
}

checkEmptyInput() {
	if [ ! ${#} = 5 ]; then
		echo "Please provide input for all prompts."
		exit 2
	fi
}


main "$@"
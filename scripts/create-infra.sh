# Function app and storage account names must be unique.

if [ -n "$1" ]; then
    randomIdentifier=$1
else
    randomIdentifier=$RANDOM
fi

location="southeastasia"
resourceGroup="msdocs-azure-functions-rg-$randomIdentifier"
tag="functions-cli-mount-files-storage-linux"
export AZURE_STORAGE_ACCOUNT="msdocsstorage$randomIdentifier"
functionApp="msdocs-serverless-function-$randomIdentifier"
skuStorage="Standard_LRS"
functionsVersion="4"
# nodeVersion="20"
share="msdocs-fileshare-$randomIdentifier"
directory="msdocs-directory-$randomIdentifier"
shareId="msdocs-share-$randomIdentifier"
mountPath="/mounted-$randomIdentifier"

# Create a resource group
echo "Creating $resourceGroup in "$location"..."
az group create --name $resourceGroup --location "$location" --tags $tag

# Create an Azure storage account in the resource group.
echo "Creating $AZURE_STORAGE_ACCOUNT"
az storage account create --name $AZURE_STORAGE_ACCOUNT --location "$location" --resource-group $resourceGroup --sku $skuStorage

# Set the storage account key as an environment variable. 
# export AZURE_STORAGE_KEY=$(az storage account keys list -g $resourceGroup -n $AZURE_STORAGE_ACCOUNT --query '[0].value' -o tsv)

# Create a serverless function app in the resource group.
echo "Creating $functionApp"
az functionapp create --name $functionApp --storage-account $AZURE_STORAGE_ACCOUNT --consumption-plan-location "$location" --resource-group $resourceGroup --os-type Linux --runtime custom --functions-version $functionsVersion

# # Work with Storage account using the set env variables.
# # Create a share in Azure Files.
# echo "Creating $share"
# az storage share create --name $share

# # Create a directory in the share.
# echo "Creating $directory in $share"
# az storage directory create --share-name $share --name $directory

# Create webapp config storage account
# echo "Creating $AZURE_STORAGE_ACCOUNT"
# az webapp config storage-account add --resource-group $resourceGroup --name $functionApp --custom-id $shareId --storage-type AzureFiles --share-name $share --account-name $AZURE_STORAGE_ACCOUNT --mount-path $mountPath --access-key $AZURE_STORAGE_KEY


echo "Please use the randomIdentifier $randomIdentifier to manage the resources."


# func azure functionapp publish msdocs-serverless-function-21002
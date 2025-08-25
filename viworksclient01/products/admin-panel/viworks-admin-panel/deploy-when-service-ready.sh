#!/bin/bash

# Deploy to Arvan Cloud - Run this when registry service is restored
# Registry: registry-ea209f2500-viworks.apps.ir-central1.arvancaas.ir
# Username: abpourebrahimi
# Password: nanbeb-nuRkys-8wyqxa

echo "====== Arvan Cloud Deployment Script ======"
echo "Registry: registry-ea209f2500-viworks.apps.ir-central1.arvancaas.ir"
echo ""

echo "🔐 Logging into Arvan Cloud Registry..."
docker login registry-ea209f2500-viworks.apps.ir-central1.arvancaas.ir -u abpourebrahimi -p nanbeb-nuRkys-8wyqxa

if [ $? -eq 0 ]; then
    echo "✅ Login successful!"
    echo ""
    
    echo "📦 Pushing backend image..."
    docker push registry-ea209f2500-viworks.apps.ir-central1.arvancaas.ir/viworks-backend:v1
    
    if [ $? -eq 0 ]; then
        echo "✅ Backend image pushed successfully!"
    else
        echo "❌ Failed to push backend image"
        exit 1
    fi
    
    echo ""
    echo "📦 Pushing frontend image..."
    docker push registry-ea209f2500-viworks.apps.ir-central1.arvancaas.ir/viworks-frontend:v1
    
    if [ $? -eq 0 ]; then
        echo "✅ Frontend image pushed successfully!"
    else
        echo "❌ Failed to push frontend image"
        exit 1
    fi
    
    echo ""
    echo "🎉 All images deployed successfully to Arvan Cloud!"
    echo ""
    echo "📋 Deployed Images:"
    echo "  - Backend:  registry-ea209f2500-viworks.apps.ir-central1.arvancaas.ir/viworks-backend:v1"
    echo "  - Frontend: registry-ea209f2500-viworks.apps.ir-central1.arvancaas.ir/viworks-frontend:v1"
    echo ""
    echo "📖 Next Steps:"
    echo "  1. Go to Arvan Cloud Dashboard"
    echo "  2. Navigate to Container Service"
    echo "  3. Create new deployment using the images above"
    echo "  4. Configure environment variables and ports"
    echo ""
    
else
    echo "❌ Login failed. Registry service may still be unavailable."
    echo "Please wait and try again later."
    exit 1
fi

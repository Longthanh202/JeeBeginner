FROM mcr.microsoft.com/dotnet/aspnet:5.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
WORKDIR /src
COPY ["JeeBeginner/JeeBeginner.csproj", "JeeBeginner/"]
RUN dotnet restore "JeeBeginner/JeeBeginner.csproj"
COPY JeeCustomer JeeCustomer/
WORKDIR "/src/JeeBeginner"
RUN dotnet build "JeeBeginner.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "JeeBeginner.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "JeeBeginner.dll"]
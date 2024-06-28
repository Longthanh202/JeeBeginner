using JeeBeginner.Reponsitories.AccountManagement;
using JeeBeginner.Reponsitories.AccountRoleManagement;
using JeeBeginner.Reponsitories.Authorization;
using JeeBeginner.Reponsitories.CustomerManagement;
using JeeBeginner.Reponsitories.DoiTacBaoHiemManagement;
using JeeBeginner.Reponsitories.DonViTinhManagement;
using JeeBeginner.Reponsitories.LoaiMatHangManagement;
using JeeBeginner.Reponsitories.LoaiTaiSanManagement;
using JeeBeginner.Reponsitories.LyDoTangGiamTaiSanManagement;
using JeeBeginner.Reponsitories.MatHangManagement;
using JeeBeginner.Reponsitories.NhanHieuManagement;
using JeeBeginner.Reponsitories.PartnerManagement;
using JeeBeginner.Reponsitories.PhanNhomTaiSanManagement;
using JeeBeginner.Reponsitories.TaikhoanManagement;
using JeeBeginner.Reponsitories.XuatXuManagement;
using JeeBeginner.Services;
using JeeBeginner.Services.AccountManagement;
using JeeBeginner.Services.AccountRoleManagement;
using JeeBeginner.Services.Authorization;
using JeeBeginner.Services.CustomerManagement;
using JeeBeginner.Services.DoiTacBaoHiemManagement;
using JeeBeginner.Services.DonViTinhManagement;
using JeeBeginner.Services.LoaiMatHangManagement;
using JeeBeginner.Services.LoaiTaiSanManagement;
using JeeBeginner.Services.LyDoTangGiamTaiSanManagement;
using JeeBeginner.Services.MatHangManagement;
using JeeBeginner.Services.NhanHieuManagement;
using JeeBeginner.Services.PartnerManagement;
using JeeBeginner.Services.PhanNhomTaiSanManagement;
using JeeBeginner.Services.TaikhoanManagement;
using JeeBeginner.Services.XuatXuManagement;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json.Serialization;
using System.Text;
using OfficeOpenXml;
using Microsoft.Extensions.FileProviders;
using System.IO;

namespace JeeBeginner
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            services.AddCors(o => o.AddPolicy("AllowOrigin", builder =>
            {
                builder.AllowAnyOrigin()
                       .AllowAnyMethod()
                       .AllowAnyHeader();
            }));

            services.AddControllers().AddNewtonsoftJson();
            services.AddControllersWithViews().AddNewtonsoftJson();
            services.AddRazorPages().AddNewtonsoftJson();
            services.AddControllers().AddNewtonsoftJson(options => { options.SerializerSettings.ContractResolver = new DefaultContractResolver(); });

            services.AddAuthentication(x =>
            {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                //options.RequireHttpsMetadata = false;
                //options.SaveToken = false;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["JWT:Secret"])),
                };
            });

            //Swagger
            services.AddSwaggerGen(c =>
            {
                var securityScheme = new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Description = "Please enter into field the word 'Bearer' following by space and JWT",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.ApiKey,
                    //Scheme = "bearer", // must be lower case
                    Reference = new OpenApiReference
                    {
                        Id = "Bearer",
                        Type = ReferenceType.SecurityScheme
                    }
                };
                c.AddSecurityDefinition(securityScheme.Reference.Id, securityScheme);
                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                                        {
                                            {securityScheme, new string[] { }}
                                        });
            });

            services.AddMvc().ConfigureApiBehaviorOptions(options =>
            {
                options.SuppressModelStateInvalidFilter = true;
            });
            services.AddOptions();
            #region add Repository
            services.AddTransient<IAccountManagementRepository, AccountManagementRepository>();
            services.AddTransient<IPartnerManagementRepository, PartnerManagementRepository>();
            services.AddTransient<IAuthorizationRepository, AuthorizationRepository>();
            services.AddTransient<ICustomerManagementRepository, CustomerManagementRepository>();
            services.AddTransient<ITaikhoanManagementRepository, TaikhoanManagementRepository>();
            services.AddTransient<IAccountRoleManagementRepository, AccountRoleManagementRepository>();
            services.AddTransient<ILoaiMatHangManagementRepository, LoaiMatHangManagementRepository>();
            services.AddTransient<INhanHieuManagementRepository, NhanHieuManagementRepository>();
            services.AddTransient<IDonViTinhManagementRepository, DonViTinhManagementRepository>();
            services.AddTransient<IXuatXuManagementRepository, XuatXuManagementRepository>();
            services.AddTransient<IDoiTacBaoHiemManagementRepository, DoiTacBaoHiemManagementRepository>();
            services.AddTransient<ILoaiTaiSanManagementRepository, LoaiTaiSanManagementRepository>();
            services.AddTransient<IPhanNhomTaiSanManagementRepository, PhanNhomTaiSanManagementRepository>();
            services.AddTransient<ILyDoTangGiamTaiSanManagementRepository, LyDoTangGiamTaiSanManagementRepository>();
            services.AddTransient<IMatHangManagementRepository, MatHangManagementRepository>();
            #endregion add Repository
            #region add service
            services.AddTransient<IPartnerManagementService, PartnerManagementService>();
            services.AddTransient<IAccountManagementService, AccountManagementService>();
            services.AddTransient<ICustomAuthorizationService, CustomAuthorizationService>();
            services.AddTransient<ICustomerManagementService, CustomerManagementService>();
            services.AddTransient<ITaikhoanManagementService, TaikhoanManagementService>();
            services.AddTransient<IAccountRoleManagementService, AccountRoleManagementService>();
            services.AddTransient<ILoaiMatHangManagementService, LoaiMatHangManagementService>();
            services.AddTransient<INhanHieuManagementService, NhanHieuManagementService>();
            services.AddTransient<IDonViTinhManagementService, DonViTinhManagementService>();
            services.AddTransient<IXuatXuManagementService, XuatXuManagementService>();
            services.AddTransient<IDoiTacBaoHiemManagementService, DoiTacBaoHiemManagementService>();
            services.AddTransient<ILoaiTaiSanManagementService, LoaiTaiSanManagementService>();
            services.AddTransient<IPhanNhomTaiSanManagementService, PhanNhomTaiSanManagementService>();
            services.AddTransient<ILyDoTangGiamTaiSanManagementService, LyDoTangGiamTaiSanManagementService>();
            services.AddTransient<IMatHangManagementService, MatHangManagementService>();
            //services.AddTransient<INhanHieuManagementService, NhanHieuManagementService>();
            #endregion add service
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "JeeBeginner v1"));
            }

            //app.UseHttpsRedirection();

            app.UseRouting();

            app.UseCors("AllowOrigin");

            app.UseAuthorization();

            app.UseStaticFiles();// For the wwwroot folder

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
            var currentDirectory = Directory.GetCurrentDirectory();
            var uploadsFolder = Path.Combine(currentDirectory, "img");
            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(uploadsFolder),
                RequestPath = "/uploads"
            });
        }
    }
}
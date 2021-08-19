using AutoMapper;
using DatingAPI.Dtos;
using DatingAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingAPI.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<User, UserListDto>().ForMember(dest => dest.PhotoUrl, opt =>
               {
                   opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.isMain).Url);
               })
                .ForMember(dest => dest.Age, opt =>
                {
                    opt.MapFrom(src => src.DateOfBirth.CalculateAge());
                });
            CreateMap<User, UserForDetailDto>().ForMember(dest => dest.Age, opt =>
               {
                   opt.MapFrom(src => src.DateOfBirth.CalculateAge());
               })
                .ForMember(dest => dest.PhotoUrl, opt =>
                {
                    opt.MapFrom(src => src.Photos.FirstOrDefault(p => p.isMain).Url);
                });
            CreateMap<Photo, PhotosForDetailsDto>();
            CreateMap<UserForUpdateDto, User>();
            CreateMap<Photo, PhotoForReturnDto>();
            CreateMap<PhotoForCreationDto,Photo>();
            CreateMap<UserForRegisterDto, User>();
            CreateMap<MessageForCreationDto,Message>().ReverseMap();
            CreateMap<Message, MessageToReturnDto>().ForMember(m=>m.SenderPhotoUrl,opt=>opt.MapFrom(u=>u.Sender.Photos.FirstOrDefault(p=>p.isMain).Url));
            CreateMap<Message, MessageToReturnDto>().ForMember(m => m.RecipientPhotoUrl, opt => opt.MapFrom(u => u.Recipient.Photos.FirstOrDefault(p => p.isMain).Url));

        }
    }
}

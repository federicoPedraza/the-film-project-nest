import { Test, TestingModule } from "@nestjs/testing";
import * as UseCase from "src/application/use-cases";
import { MongooseModule } from "@nestjs/mongoose";
import { EUserRole, IMovie, Movie, MovieSchema, StarwarsMovieSchema, UserSchema } from "src/domain/entities";
import { ConfigModule } from "@nestjs/config";
import * as Config from "src/infrastructure/config";
import * as Repository from "src/infrastructure/repositories";
import { EMovieProvider, Entity, PORT } from "src/application/enums";
import { MovieControllerV1 } from "./movie.controller";
import { MovieProviderFactoryModule } from "src/infrastructure/services";
import { DefaultApiResponse, ListMoviesPresentation, ListedMovieItemPresentation, PostMoviePresentation } from "src/application/presentations";
import { EditMovieDTO, PostMovieDTO } from "src/application/dtos";
import { HttpStatus } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { Types } from "mongoose";

describe(MovieControllerV1.name, () => {
  let controller: MovieControllerV1;
  let postMovieUseCase: UseCase.PostMovieV1;
  let listMoviesUseCase: UseCase.ListMoviesV1;
  let getMovieDetailsUseCase: UseCase.GetMovieDetailsV1;
  let deleteMovieUseCase: UseCase.DeleteMovieV1;
  let editMovieUseCase: UseCase.EditMovieV1;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forFeature([
          { name: Entity.Movie, schema: MovieSchema, discriminators: [{ name: Entity.StarwarsMovie, schema: StarwarsMovieSchema }] },
          { name: Entity.User, schema: UserSchema },
        ]),
        MovieProviderFactoryModule,
        ConfigModule.forRoot({ isGlobal: true, cache: true, expandVariables: true }),
        Config.AccessControlModule,
        Config.JWTModule,
        Config.MongoDBModule,
        Config.BcryptModule,
        HttpModule,
      ],
      controllers: [MovieControllerV1],
      providers: [
        UseCase.PostMovieV1,
        UseCase.EditMovieV1,
        UseCase.DeleteMovieV1,
        UseCase.ListMoviesV1,
        UseCase.GetMovieDetailsV1,
        {
          provide: PORT.User,
          useValue: {
            create: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: Config.JwtAuthGuard,
          useValue: { canActivate: () => true },
        },
        {
          provide: PORT.Movie,
          useValue: mockMovieRepository,
        },
        {
          provide: PORT.Starwars,
          useClass: Repository.StarwarsRepository,
        },
        {
          provide: PORT.MovieProviderStrategyFactory,
          useValue: {
            getStrategy: jest.fn().mockReturnValue(mockMovieRepository),
          },
        },
      ],
    }).compile();

    controller = module.get<MovieControllerV1>(MovieControllerV1);
    postMovieUseCase = module.get<UseCase.PostMovieV1>(UseCase.PostMovieV1);
    listMoviesUseCase = module.get<UseCase.ListMoviesV1>(UseCase.ListMoviesV1);
    getMovieDetailsUseCase = module.get<UseCase.GetMovieDetailsV1>(UseCase.GetMovieDetailsV1);
    deleteMovieUseCase = module.get<UseCase.DeleteMovieV1>(UseCase.DeleteMovieV1);
    editMovieUseCase = module.get<UseCase.EditMovieV1>(UseCase.EditMovieV1);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("post (POST)", () => {
    it("should return movie id after successful post", async () => {
      const expectedResult: DefaultApiResponse<PostMoviePresentation> = { message: "Movie posted successfully", info: { id: "id" }, status: HttpStatus.CREATED };

      const postMovieDTO: PostMovieDTO = {
        title: "test",
        director: "test",
      };

      const req = { user: { _id: "661e6abc3810b5d1ba2432d2", role: EUserRole.ADMINISTRATOR } };

      jest.spyOn(postMovieUseCase, "exec");

      const result = await controller.post(postMovieDTO, req);

      expect(result).toEqual(expectedResult);
      expect(postMovieUseCase.exec).toHaveBeenCalled();
    });
  });

  describe("list (GET)", () => {
    it("should return movie list", async () => {
      const expectedResult: DefaultApiResponse<ListMoviesPresentation> = {
        message: "List of movies returned successfully",
        info: { page: 0, items: mockedMovieList, count: mockedMovieList.length },
        status: HttpStatus.OK,
      };

      jest.spyOn(listMoviesUseCase, "exec");
      const getFilmsSpy = jest.spyOn(mockMovieRepository, "getFilms");

      const result = await controller.list(mockedMovieList.length, 0, EMovieProvider.CUSTOM);

      expect(result).toEqual(expectedResult);
      expect(listMoviesUseCase.exec).toHaveBeenCalled();
      expect(getFilmsSpy).toHaveBeenCalled();
    });
  });

  describe("getDetails (GET)", () => {
    it("should return movie details", async () => {
      const expectedResult: DefaultApiResponse<IMovie> = {
        message: "Movie details returned successfully",
        info: mockedMovieDetails,
        status: HttpStatus.OK,
      };

      jest.spyOn(getMovieDetailsUseCase, "exec");
      const getFilmSpy = jest.spyOn(mockMovieRepository, "getFilm");

      const result = await controller.getDetails(mockedMovieDetails._id, EMovieProvider.CUSTOM);

      expect(result).toEqual(expectedResult);
      expect(getMovieDetailsUseCase.exec).toHaveBeenCalled();
      expect(getFilmSpy).toHaveBeenCalled();
    });
  });

  describe("delete (DELETE)", () => {
    it("should call MovieRepository delete method on call", async () => {
      const expectedResult: DefaultApiResponse<any> = {
        message: "Movie deleted successfully",
        status: HttpStatus.OK,
      };

      jest.spyOn(deleteMovieUseCase, "exec");
      const getFilmSpy = jest.spyOn(mockMovieRepository, "getFilm");
      const deleteSpy = jest.spyOn(mockMovieRepository, "delete");

      const result = await controller.deleteMovie(EMovieProvider.CUSTOM, mockedMovieDetails._id);

      expect(result).toEqual(expectedResult);
      expect(deleteMovieUseCase.exec).toHaveBeenCalled();
      expect(getFilmSpy).toHaveBeenCalled();
      expect(deleteSpy).toHaveBeenCalled();
    });
  });

  describe("edit (PUT)", () => {
    it("should call MovieRepository update method on call", async () => {
      const expectedResult: DefaultApiResponse<any> = {
        message: "Movie editted successfully",
        status: HttpStatus.OK,
      };

      const editDto: EditMovieDTO = {
        providerFields: {
          title: "test",
        },
      };

      jest.spyOn(editMovieUseCase, "exec");
      const getFilmSpy = jest.spyOn(mockMovieRepository, "getFilm");
      const updateSpy = jest.spyOn(mockMovieRepository, "update");

      const result = await controller.updateMovie(EMovieProvider.CUSTOM, mockedMovieDetails._id, editDto);

      expect(result).toEqual(expectedResult);
      expect(editMovieUseCase.exec).toHaveBeenCalled();
      expect(getFilmSpy).toHaveBeenCalled();
      expect(updateSpy).toHaveBeenCalled();
    });
  });
});

const mockedMovieList: ListedMovieItemPresentation[] = [
  {
    title: "League of Legends",
    provider: EMovieProvider.CUSTOM,
  },
  {
    title: "Dota 2",
    provider: EMovieProvider.CUSTOM,
  },
];

const mockedMovieDetails: IMovie = {
  _id: "662130b1b8e3b5ab020e583b",
  title: "League of Legends",
  director: "Korra Jr",
  provider: EMovieProvider.CUSTOM,
  metadata: {
    uploadedBy: new Types.ObjectId("661e6abc3810b5d1ba2432d2"),
  },
  createdAt: "2024-04-18T14:39:45.320Z",
  updatedAt: "2024-04-18T14:45:18.355Z",
};

const mockMovieRepository = {
  create: jest.fn().mockResolvedValue({ _id: "id", title: "test", director: "test" } as Movie),
  getFilms: jest.fn().mockResolvedValue(mockedMovieList),
  getFilm: jest.fn().mockResolvedValue(mockedMovieDetails),
  delete: jest.fn(),
  update: jest.fn(),
};

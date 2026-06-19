import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@midwayjs/swagger';

function applyDecorators(...decorators: any[]): MethodDecorator {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    decorators.forEach(decorator => {
      if (typeof decorator === 'function') {
        decorator(target, propertyKey, descriptor);
      }
    });
  };
}
interface ApiResponseOptions {
  successDescription?: string;
  includeStandardErrors?: boolean;
  customErrors?: Array<{
    status: number;
    description: string;
  }>;
}

export const apiResponseAutoDecorator = ({
  method,
  successType,
  customErrors = [],
  includeStandardErrors = true,
  successDescription,
}: ApiResponseOptions & {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  successType?: any;
}) => {
  // 根据 HTTP 方法确定成功响应
  let successDecorator: any;
  switch (method) {
    case 'POST':
      successDecorator = ApiCreatedResponse({
        type: successType,
        description: successDescription || 'Created',
      });
      break;
    case 'DELETE':
      successDecorator = ApiNoContentResponse({
        type: successType,
        description: successDescription || 'No Content',
      });
      break;
    default:
      successDecorator = ApiOkResponse({
        type: successType,
        description: successDescription || 'Success',
      });
      break;
  }
  // 标准错误响应
  const standardErrors = includeStandardErrors
    ? [
        ApiBadRequestResponse({ description: 'Bad Request' }),
        ApiUnauthorizedResponse({ description: 'Unauthorized' }),
        ApiForbiddenResponse({ description: 'Forbidden' }),
        ApiNotFoundResponse({ description: 'Not Found' }),
        ApiConflictResponse({ description: 'Conflict' }),
        ApiInternalServerErrorResponse({
          description: 'Internal Server Error',
        }),
      ]
    : [];
  // 自定义错误响应
  const customErrorDecorators = customErrors
    .map(error => {
      const decorators = {
        400: ApiBadRequestResponse,
        401: ApiUnauthorizedResponse,
        403: ApiForbiddenResponse,
        404: ApiNotFoundResponse,
        409: ApiConflictResponse,
        500: ApiInternalServerErrorResponse,
      };
      const DecoratorClass =
        decorators[error.status as keyof typeof decorators];
      return DecoratorClass
        ? DecoratorClass({ description: error.description })
        : null;
    })
    .filter(Boolean);
  return applyDecorators(
    successDecorator,
    ...standardErrors,
    ...customErrorDecorators
  );
};

export function GetApiResponse(
  options: ApiResponseOptions & { successType?: any }
) {
  // 我们传递了一个可以修改展示格式的参数
  return apiResponseAutoDecorator({
    ...options,
    method: 'GET',
  });
}

export function PostApiResponse(
  options: ApiResponseOptions & { successType?: any }
): MethodDecorator {
  // 我们传递了一个可以修改展示格式的参数
  return apiResponseAutoDecorator({
    ...options,
    method: 'POST',
  });
}

export function PutApiResponse(
  options: ApiResponseOptions & { successType?: any }
): MethodDecorator {
  return apiResponseAutoDecorator({
    ...options,
    method: 'PUT',
  });
}
export function DeleteApiResponse(
  options: ApiResponseOptions & { successType?: any }
): MethodDecorator {
  return apiResponseAutoDecorator({
    ...options,
    method: 'DELETE',
  });
}

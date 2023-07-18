import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { modelValidationSchema } from 'validationSchema/models';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getModels();
    case 'POST':
      return createModel();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getModels() {
    const data = await prisma.model
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'model'));
    return res.status(200).json(data);
  }

  async function createModel() {
    await modelValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.robustness_check?.length > 0) {
      const create_robustness_check = body.robustness_check;
      body.robustness_check = {
        create: create_robustness_check,
      };
    } else {
      delete body.robustness_check;
    }
    const data = await prisma.model.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}

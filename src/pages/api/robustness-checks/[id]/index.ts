import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { robustnessCheckValidationSchema } from 'validationSchema/robustness-checks';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.robustness_check
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getRobustnessCheckById();
    case 'PUT':
      return updateRobustnessCheckById();
    case 'DELETE':
      return deleteRobustnessCheckById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getRobustnessCheckById() {
    const data = await prisma.robustness_check.findFirst(convertQueryToPrismaUtil(req.query, 'robustness_check'));
    return res.status(200).json(data);
  }

  async function updateRobustnessCheckById() {
    await robustnessCheckValidationSchema.validate(req.body);
    const data = await prisma.robustness_check.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteRobustnessCheckById() {
    const data = await prisma.robustness_check.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}

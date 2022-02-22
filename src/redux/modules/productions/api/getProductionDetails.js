// @flow
import { get, mock } from "src/helpers/api";
import env from "config/env";

const { MOCK_WALKIE_API, WALKIE_API_URL } = env;

export const productionDetails = {
  id: 1,
  name: "Breaking Bad",
  budget: 1000,
  currency: "USD",
  number: 200021,
  productionCompany: "rocksauce",
  type: {
    id: 3,
    name: "Series",
    sequence: 3
  },
  poster: {
    name: "p41-1510014419.jpg",
    urls: [
      "https://procliq-walkie-dev.s3.amazonaws.com/productions/41/logo/w300/p41-1510014419.jpg?X-Amz-Security-Token=FQoDYXdzEI%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaDFWFYTKyPd%2BQaXdOyyKzAu65HDljpk1qIbts%2Fpl1e4OoPV4ilqrdrFH58VSRxO5moGNqDMS7CzznsZFoQ%2BALo69IcgTwWoYswfF8yguKIEUpYGUL%2FoWc%2BnV1AF%2BOUXMMHTTFwWqDBHkD9CzDH3abxmO0ziMh3PZRifKncy0TndoNIWDPfHbx6yO8y%2BqdWdc8v6L91riqZSUWLUr47b%2B8fxSb95pd2gJE7dkebDjfmX2%2BbqzoezCMPb1%2Bh%2FxByMkv0WiklvXUJaUgJXRs4moFO8Dg68FoiIXdAKKDgrdCbJCmpwAiszBH74RVGlNC8m769NNcGVC654zHMQEKNs36YMb48E7rv2MFrzBOhoEWm4Ve3bSaW37kJH1uMS%2BunSMwTlFEHRrKZGgCrJSxBUU%2F7pkGNtCSlCE6SdPdI%2Fzr3EECVQgo07zw0AU%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20171127T141651Z&X-Amz-SignedHeaders=host&X-Amz-Expires=21600&X-Amz-Credential=ASIAIXC44IEDGKCJORJQ%2F20171127%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=ff3b99f17e658d9070bea08929a3b52fcba6d9cba57e036f45e71955800d095c",
      "https://procliq-walkie-dev.s3.amazonaws.com/productions/41/logo/w600/p41-1510014419.jpg?X-Amz-Security-Token=FQoDYXdzEI%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaDJInhMbGGKOjTXgR5yKzAr6tbXhc8ITRNExyxOfpI3mGDrtdKSmDVYbh%2BSDWyyH%2BeMlVGXNQDlc98bkHE2Fss3XlK7%2Flx1y8fa5Tw2eWapYIhmom7fSfTyYJsN4qX%2Fu45y8pN1MKKDJX3JZCJXwrxNoM3Scx1BUNMASf0fO8hu1ugDo%2Fmlx2ORr7MhEhcPFDRyRCRExNl%2FofLKLl4gBa2VBtossfFsJugzhr2PzjNUde358mZ5pGNgaxVPyYoFQ2eVPMM%2BXsaHuriGebqYn4Q5MaHanBfmK75PAXc3m3u%2FCf3IXajd8eAobxwxoNn78P1BmkQHETfnMo2ecsQw%2FCc7F3jD%2B2L7Yz1fRVggctdRN93tseyHAVQRmcTjMIj2Ttcuv8%2F9N%2Bf%2BjtCpJM2ISX5q0zY8tQzC6jkXJVLzdxqSkhJPko07zw0AU%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20171127T141651Z&X-Amz-SignedHeaders=host&X-Amz-Expires=21599&X-Amz-Credential=ASIAIMK35WTAXWV4IGNA%2F20171127%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Signature=2620c9ed418a192679f08bcf3a271e3bb23ffedbb6e8e571fda0d5b9dcc5d2ca"
    ],
    baseUrl: ""
  },
  createdAt: "2017-11-07T00:25:55Z"
};

export default (productionId: number) =>
  MOCK_WALKIE_API
    ? mock(productionDetails, 500)
    : get(`${WALKIE_API_URL}/directory/productions/${productionId}`);

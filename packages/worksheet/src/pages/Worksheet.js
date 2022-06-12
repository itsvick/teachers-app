import React from "react";
import {
  FilterButton,
  H3,
  IconByName,
  Layout,
  Loading,
  worksheetRegistryService,
} from "@shiksha/common-lib";
import { useTranslation } from "react-i18next";
import {
  Actionsheet,
  Box,
  Button,
  HStack,
  Pressable,
  Stack,
  Text,
  VStack,
} from "native-base";
import { worksheetsList } from "./../config/worksheet";
import { useNavigate, useParams } from "react-router-dom";
import manifest from "../manifest.json";
import WorksheetBox from "components/WorksheetBox";
import { defaultInputs } from "config/worksheetConfig";

export default function Worksheet({ footerLinks, appName }) {
  const { t } = useTranslation();
  const [filterObject, setFilterObject] = React.useState({});
  const [worksheets, setWorksheets] = React.useState([]);
  const [showModalSort, setShowModalSort] = React.useState(false);
  const [sortData, setSortData] = React.useState();
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();
  const { state } = useParams();

  React.useState(async () => {
    const params = state
      ? {
          state: { eq: state },
        }
      : {};
    const data = await worksheetRegistryService.getAll(params);
    const filterData = data.filter((e) => e.name);
    setWorksheets(filterData);
    setLoading(false);
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <Layout
      _header={{
        title: t("List of Worksheets"),
        iconComponent: (
          <Button
            rounded="full"
            colorScheme="button"
            variant="outline"
            bg="button.50"
            px={5}
            py={1}
            _text={{
              textTransform: "capitalize",
              fontSize: "14px",
              fontWeight: "500",
            }}
            rightIcon={<IconByName name="ArrowDownSLineIcon" isDisabled />}
            onPress={(e) => setShowModalSort(true)}
          >
            {t("SORT")}
          </Button>
        ),
      }}
      _appBar={{ languages: manifest.languages }}
      subHeader={t("See all worksheets here")}
      _subHeader={{ bg: "worksheetCard.500" }}
      _footer={footerLinks}
    >
      <FilterButton
        getObject={setFilterObject}
        _box={{ pt: 5, px: 5 }}
        _actionSheet={{ bg: "worksheetCard.500" }}
        _button={{ bg: "button.50", px: "15px", py: "2" }}
        _filterButton={{
          rightIcon: "",
          bg: "white",
        }}
        resetButtonText={t("COLLAPSE")}
        filters={defaultInputs}
      />
      <VStack>
        <Box bg="white" p="5" mb="4" roundedBottom={"xl"} shadow={2}>
          <Stack>
            <VStack space={3}>
              {worksheets.length > 0 ? (
                worksheets.map((item, index) => {
                  return (
                    <WorksheetBox
                      canShare={true}
                      key={index}
                      {...{ item, url: `/worksheet/${item.id}` }}
                      {...(state === "Draft"
                        ? {
                            canShowButtonArray: ["Like"],
                            _addIconButton: {
                              name: "EditBoxLineIcon",
                              color: "gray.500",
                              rounded: "full",
                              bg: "white",
                              p: "2",
                              shadow: 2,
                              _icon: { size: 17 },
                              onPress: (e) => navigate(`/worksheet/1/edit`),
                            },
                          }
                        : {})}
                    />
                  );
                })
              ) : (
                <Box
                  p="10"
                  my="5"
                  alignItems={"center"}
                  rounded="lg"
                  bg="viewNotification.600"
                >
                  Worksheet Not Found
                </Box>
              )}
            </VStack>
          </Stack>
        </Box>
      </VStack>
      <Box bg="white" p="5" position="sticky" bottom="84" shadow={2}>
        <Button
          _text={{ color: "white" }}
          p="3"
          onPress={(e) => navigate("/worksheet/create")}
        >
          {t("CREATE_NEW_WORKSHEET")}
        </Button>
      </Box>
      <Actionsheet
        isOpen={showModalSort}
        onClose={() => setShowModalSort(false)}
      >
        <Actionsheet.Content alignItems={"left"} bg="worksheetCard.500">
          <HStack justifyContent={"space-between"}>
            <Stack p={5} pt={2} pb="25px">
              <Text fontSize="16px" fontWeight={"600"}>
                {t("SORT")}
              </Text>
            </Stack>
            <IconByName
              name="CloseCircleLineIcon"
              color="worksheetCard.800"
              onPress={(e) => setShowModalSort(false)}
            />
          </HStack>
        </Actionsheet.Content>
        <VStack bg="white" width={"100%"} space="1">
          {[
            {
              title: "By Difficulty",
              data: [
                {
                  value: "difficulty_low_high",
                  name: "Low to High",
                  icon: "ArrowRightUpLineIcon",
                },
                {
                  value: "difficulty_high_low",
                  name: "High To Low",
                  icon: "ArrowRightDownLineIcon",
                },
              ],
            },
            {
              title: "By Popularity",
              data: [
                {
                  value: "popularity_low_high",
                  name: "Low to High",
                  icon: "ArrowRightUpLineIcon",
                },
                {
                  value: "popularity_high_low",
                  name: "High To Low",
                  icon: "ArrowRightDownLineIcon",
                },
              ],
            },
          ].map((value, index) => (
            <Box key={index}>
              <Box px="5" py="4">
                <H3 color="gray.400">{value?.title}</H3>
              </Box>
              {value?.data &&
                value.data.map((item, subIndex) => (
                  <Pressable
                    key={subIndex}
                    p="5"
                    bg={sortData === item.value ? "gray.100" : ""}
                    onPress={(e) => {
                      setSortData(item.value);
                    }}
                  >
                    <HStack space="2" colorScheme="button" alignItems="center">
                      <IconByName
                        isDisabled
                        color={sortData === item.value ? "button.500" : ""}
                        name={item.icon}
                      />
                      <Text>{item.name}</Text>
                    </HStack>
                  </Pressable>
                ))}
            </Box>
          ))}
          <Box p="5">
            <Button
              colorScheme="button"
              _text={{ color: "white" }}
              onPress={(e) => setShowModalSort(false)}
            >
              {t("CONTINUE")}
            </Button>
          </Box>
        </VStack>
      </Actionsheet>
    </Layout>
  );
}

const LessonPlans = () => {
  return <h4>LessonPlans</h4>;
};

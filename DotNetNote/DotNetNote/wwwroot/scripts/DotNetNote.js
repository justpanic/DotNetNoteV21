﻿/**
 * @target 게시판 페이지 관리 모듈
 */

/**
 * 게시판 페이지 공지사항 관리 모듈 개체입니다.
 * 
 * @type {object}
 * @class loginNotice
 * @namespace loginNotice
 */
var loginNotice = (function () {
    /**
     * 메인 공지사항 페이지
     */
    var mainPage = 1;

    /**
     * 메인 공지사항 전체 페이지 수
     */
    var mainCount = 0;

    /**
     * 팝업 공지사항 페이지
     */
    var popupPage = 1;

    /**
     * 팝업 공지사항 전체 페이지 수
     */
    var popupCount = 0;

    return {
        /**
         * 게시판 페이지의 메인 공지사항 목록을 렌더합니다.
         * 
         * @author PARK YONGJUNE
         * @date 2019. 04. 20.
         * @memberOf loginNotice
         * @param {number} page - 페이지
         */
        renderMainList: function (page) {
            try {
                if (!page || isNaN(page)) {
                    page = 1;
                }

                $.ajax({
                    url: "/DotNetNote/MainList",
                    type: "POST",
                    data: "page=" + page,
                    cache: false,
                    dataType: "json",
                    success: function (data, textStatus, jqXHR) {
                        var list = data.list;
                        var count = data.count;

                        // 페이지 정보
                        mainPage = page;
                        mainCount = Math.ceil(count / 5);

                        $(".mainBoard > .util > span").html(mainPage);
                        $(".mainBoard > .util > i").html(mainCount);

                        // 목록 생성
                        var listBase = $(".mainBoard .list");
                        var html = "";
                        listBase.html("");
                        for (var i = 0; i < list.length; i++) {
                            html += "<dd>";
                            html += "<a href='javascript:loginNotice.showPopupView(" + list[i].num + ", true);'>";
                            html += "<p class='tit'>" + list[i].title + "</p>";
                            html += "<p class='date'>" + list[i].postDate + "</p>";
                            html += "</a>";
                            html += "</dd>";
                        }
                        listBase.html(html);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.log("공지사항 목록을 가져오던 중, 알 수 없는 오류가 발생했습니다.");
                    }
                });
            } catch (e) {
                console.log("loginNotice.renderSimpleList: " + e);
            }
        },
        /**
         * 게시판 페이지의 팝업 공지사항 목록을 렌더합니다.
         * 
         * @author PARK YONGJUNE
         * @date 2019. 04. 20.
         * @memberOf loginNotice
         * @param {number} page - 페이지
         */
        renderPopupList: function (page) {
            try {
                if (!page || isNaN(page)) {
                    page = 1;
                }

                $.ajax({
                    url: "/DotNetNote/PopupList",
                    type: "POST",
                    data: "page=" + page + "&keyword=" + encodeURI($("#txtSearch").val()),
                    cache: false,
                    dataType: "json",
                    success: function (data, textStatus, jqXHR) {
                        var list = data.list;
                        var count = data.count;

                        // 페이지 정보
                        popupPage = page;
                        popupCount = Math.ceil(count / 5);
                        var startNum = (count - (popupPage - 1) * 5);

                        // 목록 생성
                        var listBase = $("#popupLeft .tableWrap tbody");
                        var html = "";
                        listBase.html("");
                        for (var i = 0; i < list.length; i++) {
                            html += "<tr>";
                            html += "<td class='num'>" + (startNum - i) + "</td>";
                            html += "<td class='tit' style='width: 70%;'><a href='javascript:loginNotice.showPopupView(" + list[i].num + ");'>" + list[i].title + "</a></td>";
                            if (data.fileName != null && data.fileName.length > 0) {
                                html += "<td><span class='file'>file</span></td>";
                            } else {
                                html += "<td>&nbsp;</td>";
                            }
                            html += "<td class='text-center'>" + list[i].postDate + "</td>";
                            html += "<td class='text-right'>" + "수정, 삭제</td>";
                            html += "</tr>";
                        }
                        listBase.html(html);

                        // 페이징 처리
                        var pgStart = Math.floor((popupPage - 1) / 5) * 5 + 1;

                        html = "<button class='prev2 first'>처음</button> <button class='prev'>이전</button> ";
                        for (var i = 0; i < 5; i++) {
                            var cur = pgStart + i;
                            if (cur > popupCount) {
                                break;
                            }
                            if (popupPage == cur) {
                                html += "<a href='#' class='on'>" + cur + "</a> ";
                            } else {
                                html += "<a href='javascript:loginNotice.renderPopupList(" + cur + ");'>" + cur + "</a> ";
                            }
                        }
                        html += "<button class='next'>다음</button> <button class='next2 last'>끝</button>";

                        $("#popupLeft .page").html(html);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.log("공지사항 목록을 가져오던 중, 알 수 없는 오류가 발생했습니다.");
                    }
                });
            } catch (e) {
                console.log("loginNotice.renderPopupList: " + e);
            }
        },
        /**
         * 게시판 페이지의 메인 공지사항 목록을 이동합니다.
         * 
         * @author PARK YONGJUNE
         * @date 2019. 04. 20.
         * @memberOf loginNotice
         * @param {object} event - event 개체
         */
        moveMainList: function (event) {
            var $btn = $(event.target);
            if ($btn.hasClass("prev")) {
                mainPage--;
                if (mainPage < 1) {
                    mainPage = 1;
                }
            } else if ($btn.hasClass("next")) {
                mainPage++;
                if (mainPage > mainCount) {
                    mainPage = mainCount;
                }
            }

            loginNotice.renderMainList(mainPage);
        },
        /**
         * 게시판 페이지의 팝업 공지사항 목록을 이동합니다.
         * 
         * @author PARK YONGJUNE
         * @date 2019. 04. 20.
         * @memberOf loginNotice
         * @param {object} event - event 개체
         */
        movePopupList: function (event) {
            var $btn = $(event.target);
            var pgStart = Math.floor((popupPage - 1) / 5) * 5 + 1;

            if ($btn.hasClass("prev2")) {
                popupPage = 1;
            } else if ($btn.hasClass("prev")) {
                popupPage--;
                if (popupPage < 1) {
                    popupPage = 1;
                }
            } else if ($btn.hasClass("next")) {
                popupPage++;
                if (popupPage > popupCount) {
                    popupPage = popupCount;
                }
            } else if ($btn.hasClass("next2")) {
                popupPage = popupCount;
            }

            loginNotice.renderPopupList(popupPage);
        },
        /**
         * 좌측 팝업 목록을 출력합니다.
         * 
         * @author PARK YONGJUNE
         * @date 2019. 04. 20.
         * @memberOf loginNotice
         * @param {object} event - event 개체
         */
        showPopupList: function (event) {
            $("#popupLeft .tableWrap").css("display", "block");
            $("#popupLeft .view").css("display", "none");

            $("#popupLeft").addClass("on");
            $("#dim").show();
        },
        /**
         * 좌측 상세를 출력합니다.
         * 
         * @author PARK YONGJUNE
         * @date 2019. 04. 20.
         * @memberOf loginNotice
         * @param {number} num - 공지사항 상세 일련번호
         * @param {boolean} clearFilter - 검색 조건 초기화 여부
         */
        showPopupView: function (num, clearFilter) {

            if (clearFilter != null && clearFilter === true) {
                $("#txtSearch").val("");
            }

            $("#popupLeft .tableWrap").css("display", "none");
            $("#popupLeft .view").css("display", "block");

            try {
                $.ajax({
                    url: "/DotNetNote/NoticeView",
                    type: "POST",
                    data: "num=" + num + "&keyword=" + encodeURI($("#txtSearch").val()),
                    cache: false,
                    dataType: "json",
                    success: function (data, textStatus, jqXHR) {
                        $("#popupLeft .view > .tit").html(data.title + "<span>" + data.postDate + "</span>");
                        $("#popupLeft .view > .cont").html(data.content);

                        if (data.fileName != null && data.fileName.length > 0) {
                            $("#popupLeft .view > .fileWrap > .fileCont").html("<a href='/Login/Download/?num=" + num + "'>" + data.fileName + "</a>");
                        } else {
                            $("#popupLeft .view > .fileWrap > .fileCont").html("<a href='#'>N/A</a>");
                        }

                        if (data.nextTitle === "") {
                            $("#popupLeft .view > .util > .next").html("<a href='#'>Next article does not exist.</a>");
                        } else {
                            $("#popupLeft .view > .util > .next").html("<a href='javascript:loginNotice.showPopupView(" + data.nextNum + ");'>" + data.nextTitle + "</a>");
                        }

                        if (data.prevTitle === "") {
                            $("#popupLeft .view > .util > .prev").html("<a href='#'>Prev. article does not exist.</a>");
                        } else {
                            $("#popupLeft .view > .util > .prev").html("<a href='javascript:loginNotice.showPopupView(" + data.prevNum + ");'>" + data.prevTitle + "</a>");
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.log("공지사항 상세정보를 가져오던 중, 알 수 없는 오류가 발생했습니다.");
                    }
                });
            } catch (e) {
                console.log("loginNotice.showPopupView: " + e);
            }

            //$("#popupLeft").addClass("on");
            //$("#dim").show();
        }
    }
})();